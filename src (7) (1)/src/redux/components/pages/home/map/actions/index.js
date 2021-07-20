import * as Types from './types';


export const onUpdateLatLng = (latitude, longitude) => {
    return (dispatch, getState) => {
        dispatch({ type: Types.UPDATE_LAT_LNG, payload: { latitude, longitude } })
    }
}


export const onUpdateLastSelectedPosition = (latitude, longitude) => {
    return (dispatch, getState) => {
        dispatch({ type: Types.UPDATE_LAST_SELECTED_POSITION, payload: { latitude, longitude } })
    }
}

export const resetLastSelectedPosition = () => {
    return dispatch => {
        dispatch({ type: Types.RESET_LAST_SELECTED_POSITION })
    }
}
