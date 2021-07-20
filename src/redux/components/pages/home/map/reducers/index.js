import * as Types from '../actions/types';

const initialState = {
  latitude: '53.079296',
  longitude: '8.801694',
  lastSelectedPostion: null
};


const homeMapReducer = (state = initialState, action) => {
  switch (action.type) {

    case Types.UPDATE_LAT_LNG: {
      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude
      };
    }

    case Types.UPDATE_LAST_SELECTED_POSITION: {
      return {
        ...state,
        lastSelectedPostion: [action.payload.latitude, action.payload.longitude]
      };
    }

    case Types.RESET_LAST_SELECTED_POSITION: {
      return {
        ...state, lastSelectedPostion: null
      }
    }

    default:
      return state;
  }
}

export default homeMapReducer;
