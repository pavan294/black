import { Auth } from 'aws-amplify';
import * as Types from '../actions/types';

const initialState = {
  };


const homeHeaderReducer = (state=initialState, action) => {
    switch(action.type) {
      
        case Types.LOGOUT: {
            console.log('Logging out')
            Auth.signOut({ global: true })
                .then(data => console.log("Logged out"))
                .catch(err => console.log(err));
            return state;
          }    


        default:
            return state;
    }
}

export default homeHeaderReducer;
