import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './root/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
