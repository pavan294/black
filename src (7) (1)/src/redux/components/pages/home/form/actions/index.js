import * as Types from './types';


export const setModalVisibleTrue = (formData) => {
    return dispatch => {
        dispatch({ type: Types.SET_MODAL_VISIBLE_TRUE, payload: { formData } })

    }
}

export const setModalVisibleFalse = () => {
    return dispatch => {
        dispatch({ type: Types.SET_MODAL_VISIBLE_FALSE })

    }
}

export const updateModalHeader = (header) => {
    return dispatch => {
        dispatch({ type: Types.UPDATE_MODAL_HEADER, payload: { header } })

    }
}
