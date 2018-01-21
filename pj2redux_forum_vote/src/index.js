import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './root/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';  //review 1: applyMiddleware, compose are added
import reducer from './reducer/';
import { Provider } from 'react-redux';
//review: 1 added for react-router-redux
import { routerMiddleware, ConnectedRouter } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'


//review: 1 added for react-router-redux
export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension
  
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

let store = createStore(
    reducer,
    initialState,
    composedEnhancers
)
////////////////////////////////////////


// let store = createStore(
//     reducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// store.dispatch(addPost({
//     title: "first redux",
//     body: "I am happy that the first store is made!"
// }))


ReactDOM.render(
    <Provider store = { store }>
        {/*review: 1 added for react-router-redux */}
        <ConnectedRouter history={history}>     
            <App />
        </ConnectedRouter>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
