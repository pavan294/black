import * as Types from '../actions/types';

const initialState = {
    windfarmData: [],
    turbineData: [],
    jobData: [],
    lastgangData: [],
    inputList: [],
    tableFilters: {},
    selectedRowKeys: [],
    selectedRowsCoordinates: [],
    currentPageNumber: 1,
    jobTablesPageNumbers: {}
};


const homeTableReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_WINDFARM_DATA: {

            return {
                ...state,
                windfarmData: action.payload.windfarmData,

            };
        }

        case Types.FETCH_TURBINE_DATA: {

            return {
                ...state,
                turbineData: action.payload.turbineData,

            };
        }

        case Types.FETCH_JOB_DATA: {

            return {
                ...state,
                jobData: action.payload.jobData,

            };
        }

        case Types.POST_ROW: {

            return {
                ...state
            };
        }

        case Types.PATCH_ROW: {

            return {
                ...state
            };
        }

        case Types.DELETE_ROW: {

            return {
                ...state
            };
        }

        case Types.CREATE_JOB: {



            return {
                ...state,

            };
        }

        case Types.UPDATE_JOB_STATUS: {
            return {
                ...state,

            };
        }

        case Types.DELETE_JOB: {
            return {
                ...state,

            };
        }

        case Types.UPLOAD_CSV: {

            return {
                ...state,

            };
        }

        case Types.FETCH_LASTGANG_DATA: {

            return {
                ...state,
                lastgangData: action.payload.lastgangData
            };
        }

        case Types.FETCH_INPUT_LIST: {
            return {
                ...state,
                inputList: action.payload.inputList
            };
        }

        case Types.UPDATE_TABLE_FILTERS: {
            return {
                ...state,
                tableFilters: action.payload.filter
            }
        }

        case Types.SET_PROPS_TABLE: {
            return {
                ...state, ...action.payload
            }
        }

        case Types.UPDATE_SELECTED_ROW_COORDINATES: {
            return {
                ...state,
                selectedRowsCoordinates: action.payload
            }
        }

        default:
            return state;
    }
}

export default homeTableReducer;
