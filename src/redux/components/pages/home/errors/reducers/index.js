import * as Types from '../actions/types';

const initialState = {
  status: false,
  errorType: "",
  errorMessage: "",
};


const homeErrorReducer = (state = initialState, action) => {
  switch (action.type) {

    case Types.SET_ERROR_TRUE: {
      return {
        status: true,
        errorType: action.payload.errorType,
        errorMessage: action.payload.errorMessage,


      };
    }
    case Types.SET_ERROR_FALSE: {
      return {
        status: false,
        errorType: "",
        errorMessage: "",

      };
    }
    case Types.SET_404_ERROR: {
      return {
        errorType: '404',
        errorMessage: 'OOPS! THE PAGE YOU ARE LOOKING FOR DOESN\'T EXIST.',
        status: true
      }
    }



    default:
      return state;
  }
}

export default homeErrorReducer;
