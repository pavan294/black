import * as Types from './types';

export const setErrorTrue = (errorType, errorMessage) => {
    return (dispatch, getState) => {
        dispatch({type : Types.SET_ERROR_TRUE, payload : { errorType : errorType, errorMessage : errorMessage } })
    }
}

export const setErrorFalse = () => {
    return (dispatch, getState) => {
        if (getState().home.errors.status === true) {
            dispatch({type : Types.SET_ERROR_FALSE})
        }
        
    }
}

export const set404Error = () => {
    return (dispatch, getState) => {
        dispatch({ type: Types.SET_404_ERROR })
    }
}

