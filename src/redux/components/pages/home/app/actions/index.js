import * as Types from './types'

export const updateAppIdleState = (idle_state) => {
    return (dispatch) => {
        dispatch({ type: Types.UPDATE_APP_IDLE_STATE, payload: idle_state })
    }
}

export const updateAxiosFailCount = (counter) => {
    return (dispatch) => {
        dispatch({ type: Types.UPDATE_AXIOS_FAIL_COUNT, payload: counter })
    }
}

export const setFarmType = farmType => {
    return { type: Types.SET_FARM_TYPE, payload: farmType }
}
