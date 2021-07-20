import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import appReducer from '../components/pages/home/app/reducers'
import homeHeaderReducer from '../components/pages/home/header/reducers';
import homeFormReducer from '../components/pages/home/form/reducers';
import homeMapReducer from '../components/pages/home/map/reducers';
import homeTableReducer from '../components/pages/home/table/reducers';
import homeErrorReducer from '../components/pages/home/errors/reducers';


const homeReducer = combineReducers({
  app: appReducer,
  header: homeHeaderReducer,
  form: homeFormReducer,
  map: homeMapReducer,
  errors: homeErrorReducer,
  table: homeTableReducer
});


const rootReducer = combineReducers({
  home: homeReducer

});

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk),
  // other store enhancers if any
));

export default store;
