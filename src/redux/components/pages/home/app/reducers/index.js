import * as Types from '../actions/types';
import { WINDFARM } from '../../../../../../constants';

const initialState = {
    idle_state: false,
    axios_fail_count: 0,
    farmType: WINDFARM
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.UPDATE_APP_IDLE_STATE: {
            return {
                ...state,
                idle_state: action.payload,
            };
        }
        case Types.UPDATE_AXIOS_FAIL_COUNT: {
            return {
                ...state,
                axios_fail_count: action.payload
            }
        }

        case Types.SET_FARM_TYPE: {
            return { ...state, farmType: action.payload }
        }

        default:
            return state;
    }
}

export default appReducer;