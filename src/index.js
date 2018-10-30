import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { LocaleProvider } from 'antd';
import * as serviceWorker from './serviceWorker';
import { Switch, HashRouter, Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Demo1 from './Demo1';
import Demo2 from './Demo2';
import SaveActionForm from './action/SaveAction';
import ActionList from './action/ActionList';
import zhCN from 'antd/lib/locale-provider/zh_CN';
ReactDOM.render(
    <HashRouter>
        <LocaleProvider locale={zhCN}>
            <App>
                <Route path="/saveaction?id=:id" component={SaveActionForm} />
                <Route path="/saveaction" component={SaveActionForm} />
                <Route path="/actionlist" component={ActionList} />
                <Route path="/demo1" component={Demo1} />
                <Route path="/demo2" component={Demo2} />
            </App>
        </LocaleProvider>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
