import axios from '../../../../../axios'
import * as Types from './types';
import { UPDATE_LAST_SELECTED_POSITION } from '../../map/actions/types'
import _ from 'lodash'
import { WINDFARM } from '../../../../../../constants';

const store = require('../../../../../store')
const BASE_URL = process.env.REACT_APP_GREENBITS_API_BASE_URL

const HEADERS = { 'Content-Type': 'application/json' }

const get_file_power = (manufacturer, model, turbineData) => {
    for (let i = 0; i < turbineData.length; i++) {
        if ((turbineData[i].manufacturername === manufacturer) && (turbineData[i].modelname === model)) {
            return turbineData[i].filename
        }
    }
}


export const createJob = (input, model_args) => {
    return (dispatch, getState) => {
        let data = { ...model_args }
        data["_id"] = input.map(d => d._id)
        data["unit_time"] = "UTC"
        data["project"] = []
        input.forEach(dealInput => {
            let deal = {}
            // Defaults to None for now
            deal["wka_rotor_diameter"] = null
            deal["wka_startschall"] = dealInput["wka_startschall"] ? dealInput["wka_startschall"] : null
            deal["wka_endschall"] = dealInput["wka_endschall"] ? dealInput["wka_endschall"] : null
            deal["wka_reduction_schall"] = dealInput["wka_reduction_schall"] ? dealInput["wka_reduction_schall"] : null
            deal["wka_dimension"] = "meter"
            deal["pv_azimuth"] = 180
            deal["pv_tilt"] = 33.36
            deal["acdc_capacity"] = 660
            deal["unit_power"] = "kW"
            deal["unit_production"] = "kWh"
            deal["actual_source"] = "LASTGANG_ID"
            if (dealInput["type"] === "solar") {
                deal["latitude"] = dealInput["latitude"]
                deal["longitude"] = dealInput["longitude"]
                deal["acdc_capacity"] = dealInput["acdc_capacity"]
                deal["actual_source"] = dealInput["actual_source"]
                deal["pv_panel"] = dealInput["pv_panel"]
                deal["pv_azimuth"] = dealInput["pv_azimuth"] ? dealInput["pv_azimuth"] : null
                deal["type"] = dealInput["type"]
                deal["name"] = dealInput["project"]
                deal["pv_tilt"] = dealInput["pv_tilt"]
                deal["rated_capacity"] = dealInput["rated_capacity"]
                deal["unit_power"] = dealInput["unit_power"]
                deal["unit_production"] = dealInput["unit_production"]
            } else {
                deal["latitude"] = dealInput["latitude"]
                deal["longitude"] = dealInput["longitude"]
                deal["wka_hubheight"] = dealInput["hubHeight"]
                deal["manufacturer"] = dealInput["manufacturer"]
                deal["model"] = dealInput["model"]
                deal["lastgang"] = dealInput["lastgang"] ? dealInput["lastgang"] : null
                deal["type"] = dealInput["type"]
                deal["name"] = dealInput["project"]
                deal["number_elements"] = dealInput["turbines"]
                deal["file_power"] = get_file_power(dealInput["manufacturer"], dealInput["model"], getState().home.table.turbineData)
                deal["rated_capacity"] = dealInput["ratedPower"]
            }
            data["project"].push(Object.assign(deal))
        })

        console.log("jobs", data)

        return axios.post(BASE_URL + '/job', data, {
            headers: HEADERS
        })
            .then(response => {
                dispatch({ type: Types.CREATE_JOB })
            })
            .catch(e => console.log(e))
    }
}


export const deleteJob = (job_id) => {
    return dispatch => {
        return axios.delete(BASE_URL + '/job/' + job_id, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
            .then(response => {
                dispatch({ type: Types.DELETE_JOB })
            })
            .catch(e => console.log(e))
    }
}


export const updateJobStatus = (job_id) => {
    return dispatch => {
        return axios.get(`${BASE_URL}/job/${job_id}/status`, {
            headers: HEADERS
        })
            .then(response => {
                dispatch({ type: Types.UPDATE_JOB_STATUS })
            })
            .catch(e => console.log(e))
    }
}


export const postRow = (doc) => {
    return dispatch => {
        return axios.post(BASE_URL + '/greenbits-data', doc, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                dispatch({ type: Types.POST_ROW })
                dispatch({ type: UPDATE_LAST_SELECTED_POSITION, payload: { latitude: doc.latitude, longitude: doc.longitude } })
            })
            .catch(e => console.log(e))
    }
}


export const patchRow = (doc_id, doc, cb) => {
    return dispatch => {
        return axios.put(BASE_URL + '/greenbits-data/' + doc_id, doc, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                dispatch({ type: Types.PATCH_ROW })
                if (_.isFunction(cb)) {
                    cb()
                }
            })
            .catch(e => console.log(e))
    }
}



export const deleteRow = (doc_id) => {
    return dispatch => {
        return axios.delete(BASE_URL + '/greenbits-data/' + doc_id, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                dispatch({ type: Types.DELETE_ROW })
            })
            .catch(e => console.log(e))
    }
}


export const fetchWindfarmData = (cb) => {
    return (dispatch, getState) => {
        return axios.get(BASE_URL + '/greenbits-data', {
            // timeout : 5000,
            headers: HEADERS
        })
            .then(response => {
                response.data.forEach(farmData => {
                    if (!_.has(farmData, "date_added")) {
                        farmData.date_added = "2020-04-08"
                    }
                    if (!_.has(farmData, "author")) {
                        farmData.author = "Henrik Tietje"
                    }
                })
                const farmType = getState().home.app.farmType
                const farmFilter = farmType === WINDFARM
                    ? farm => ["Offshore", "Onshore"].includes(farm.type)
                    : farm => farm.type === "solar"
                dispatch({
                    type: Types.FETCH_WINDFARM_DATA,
                    payload: {
                        windfarmData: response.data
                            .filter(farmFilter)
                    }
                })

                // update selected rows coordinates
                let selectedRowKeys = _.cloneDeep(store.default.getState().home.table.selectedRowKeys)
                let selectedRowKeysCoordsFromStore = _.cloneDeep(store.default.getState().home.table.selectedRowsCoordinates)
                let selectedRowCoordinates = []
                selectedRowKeys.forEach(row_id => {
                    let farm = _.filter(response.data.filter(farmFilter), { _id: row_id })
                    farm.forEach(row => {
                        selectedRowCoordinates.push([row.latitude, row.longitude])
                    })
                })
                if (!_.isEqual(selectedRowCoordinates, selectedRowKeysCoordsFromStore)) {
                    dispatch({
                        type: Types.UPDATE_SELECTED_ROW_COORDINATES,
                        payload: selectedRowCoordinates
                    })
                }
                if (_.isFunction(cb)) {
                    cb(response.data.filter(farmFilter))
                }
            })
            .catch(e => console.log(e))
    }
}


export const fetchTurbineData = () => {
    return dispatch => {
        return axios.get(BASE_URL + '/turbine-data', {
            // timeout : 5000,
            headers: HEADERS
        })
            .then(response => {
                dispatch({ type: Types.FETCH_TURBINE_DATA, payload: { turbineData: response.data } })
            })
            .catch(e => console.log(e))


    }
}

export const fetchJobData = () => {
    return dispatch => {
        return axios.get(BASE_URL + '/job', {
            // timeout : 5000,
            headers: HEADERS
        })
            .then(response => {
                dispatch({ type: Types.FETCH_JOB_DATA, payload: { jobData: response.data } })
            })
            .catch(e => console.log(e))


    }
}

export const fetchJobInput = (job_id) => {
    return dispatch => {
        return axios.get(BASE_URL + '/job/' + job_id + '/input', {
            headers: HEADERS
        }
        )
            .then(response => {
                window.open(response.config.url, "_self")
            })
            .catch(e => console.log(e))


    }
}

export const fetchJobOutput = (job_id) => {
    return dispatch => {
        return axios.get(BASE_URL + '/job/' + job_id + '/output', {
            headers: HEADERS
        }
        )
            .then(response => {
                window.open(response.config.url, "_self")
            })
            .catch(e => console.log(e))


    }
}

export const fetchJobLogs = (job_id) => {
    console.log("logs with ", job_id)
    return dispatch => {
        return axios.get(BASE_URL + '/job/' + job_id + '/logs',
        )
            .then(response => {
                console.log(response)
                window.open(response.config.url, "_self")
            })
            .catch(e => console.log(e))


    }
}

export const uploadCSV = (filename) => {
    let data = {}
    data["type"] = "timeseries"
    data["filename"] = filename
    data["importpath"] = "s3://ewe-trading-shortterm/direct_sales/"
    data["exportpath"] = "s3://ewe-trading-analyse/windfarmtest/"

    console.log(data)
    return dispatch => {
        return axios.post(BASE_URL + '/greenbits-data/input/upload/', data, {
            headers: {
                'Content-Type': 'application/json'
            },
            verify: false
        })
            .then(response => {
                dispatch({ type: Types.UPLOAD_CSV })
            })
            .catch(e => console.log(e))
    }
}

export const fetchInputList = () => {
    let data = {}
    data["type"] = "timeseries"
    data["exportpath"] = "s3://ewe-trading-shortterm/direct_sales/"

    console.log(data)
    return dispatch => {
        return axios.post(BASE_URL + '/greenbits-data/input/list/', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                dispatch({ type: Types.FETCH_INPUT_LIST, payload: { inputList: response.data } })
            })
            .catch(e => console.log(e))
    }
}

export const fetchLastgangData = () => {
    let data = {}
    data["type"] = "timeseries"
    data["exportpath"] = "s3://ewe-trading-analyse/windfarmtest/"

    console.log(data)
    return dispatch => {
        return axios.post(BASE_URL + '/greenbits-data/input/list/', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                dispatch({ type: Types.FETCH_LASTGANG_DATA, payload: { lastgangData: response.data } })
            })
            .catch(e => console.log(e))
    }
}

export const updateTableFilters = (filter) => {
    return dispatch => {
        dispatch({ type: Types.UPDATE_TABLE_FILTERS, payload: { filter } })
    }
}

export const setProps = payload => {
    return { type: Types.SET_PROPS_TABLE, payload }
}
