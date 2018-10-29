import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Switch,HashRouter, Route,Link,BrowserRouter as Router } from 'react-router-dom'
import Demo1 from './Demo1';
import Demo2 from './Demo2';

ReactDOM.render(
<HashRouter>
    <App>
        <Route path="/demo1" component={Demo1}/>
        <Route path="/demo2" component={Demo2}/>
    </App>
</HashRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
