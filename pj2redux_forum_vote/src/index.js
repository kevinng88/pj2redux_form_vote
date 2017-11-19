import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './root/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import reducer from './reducer/';
import { Provider } from 'react-redux';

let store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );


// store.dispatch(addPost({
//     title: "first redux",
//     body: "I am happy that the first store is made!"
// }))


ReactDOM.render(<Provider store = { store }><App /></Provider>, document.getElementById('root'));
registerServiceWorker();