// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'


// Components
import store from './redux/store'
import App from './react/app';



ReactDOM.render(
    <Provider store={store}>
        <Router basename={process.env.REACT_APP_BASENAME}>
            <App />
        </Router>
    </Provider>, 
    document.getElementById('root'));

// Enable Hot Module Replacement
if (module.hot) {
    module.hot.accept()
}

// expose store in development mode
if (process.env.NODE_ENV === "development") {
    window['__REDUX_DEVTOOLS_EXTENSION__'] = window.parent['__REDUX_DEVTOOLS_EXTENSION__'];
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] = window.parent['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'];
    window.store = store
  }
    
