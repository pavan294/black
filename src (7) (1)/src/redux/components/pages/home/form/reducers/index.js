import * as Types from '../actions/types';

const initialState = {
      modalVisible : false,
      modalHeader : "Add Windfarm",
      formData : {},
  };


const homeFormReducer = (state=initialState, action) => {
    switch(action.type) {
      
    
      case Types.SET_MODAL_VISIBLE_TRUE: {
        return {
            ...state,
            modalVisible : true,
            formData : action.payload.formData
          
        };
      }

      case Types.SET_MODAL_VISIBLE_FALSE: {
        return {
            ...state,
            modalVisible : false,
            modalHeader : "Add Windfarm",
            formData : {}
          
        };
      }

      case Types.UPDATE_MODAL_HEADER: {
        return {
            ...state,
            modalHeader : action.payload.header,
          
        };
      }

    

      default:
        return state;
    }
}

export default homeFormReducer;
