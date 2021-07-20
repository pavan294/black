import axios from 'axios'
import * as AppActionTypes from '../components/pages/home/app/actions/types'
import * as ErrorsTypes from '../components/pages/home/errors/actions/types'
import _ from 'lodash'

const store = require('../store')
const BASE_URL = process.env.REACT_APP_GREENBITS_API_BASE_URL
const MAX_AXIOS_FAIL_COUNTER = process.env.REACT_APP_MAX_AXIOS_FAIL_COUNTER
let PENDING_GET_REQUESTS = []


// Axios request interceptor
axios.interceptors.request.use(function (config) {
    let appIsIdle = store.default.getState().home.app.idle_state;
    // if application is idle or request is GET and have any pending instance, then cancel all axios requests
    if (appIsIdle || (config.method === "get" && _.find(PENDING_GET_REQUESTS, { "url": config.url, "params": config.params }))) {
        return {
            ...config,
            cancelToken: new axios.CancelToken((cancel) => cancel('Cancel request as application is idle or duplicate request.'))
        };
    }
    if (config.method === "get") {
        PENDING_GET_REQUESTS.push({ "url": config.url, "params": config.params })
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Axios response interceptor
axios.interceptors.response.use(function (response) {
    // remove call from pending calls, if GET call
    if (_.has(response.config, 'method') && response.config.method === "get") {
        _.remove(PENDING_GET_REQUESTS, { "url": response.config.url, "params": response.config.params })
    }
    // Reset Axios fail counter in the store if axios call succeed
    store.default.dispatch({ type: AppActionTypes.UPDATE_AXIOS_FAIL_COUNT, payload: 0 })
    return response;
}, function (error) {
    // remove call from pending calls, if GET call
    if (_.has(error.config, 'method') && error.config.method === "get") {
        _.remove(PENDING_GET_REQUESTS, { "url": error.config.url, "params": error.config.params })
    }
    // Capture errors only from BASE_URL domain
    if (_.has(error.config, 'url') && _.startsWith(error.config.url, BASE_URL)) {
        let axios_fail_count = _.cloneDeep(store.default.getState().home.app.axios_fail_count)
        // update axios fail counter by 1 in the store
        store.default.dispatch({ type: AppActionTypes.UPDATE_AXIOS_FAIL_COUNT, payload: axios_fail_count + 1 })
        // Set error to true if max axios fail retries exceed
        if (axios_fail_count >= MAX_AXIOS_FAIL_COUNTER) {
            store.default.dispatch({ type: ErrorsTypes.SET_ERROR_TRUE, payload: { errorType: '500', errorMessage: 'Sorry, the backend seems to be temporarily unavailable. If the problem persists, contact the admins :-)' } })
        }
    }
    return Promise.reject(error);
});

export default axios;
