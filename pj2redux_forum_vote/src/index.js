import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './root/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore }from 'redux';
import reducer from './reducer/';
import { addPost } from './action'

let store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );


store.dispatch(addPost({
    title: "first redux",
    body: "I am happy that the first store is made!"
}))

console.log(store.getState());

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
