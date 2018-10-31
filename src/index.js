import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { LocaleProvider } from 'antd';
import * as serviceWorker from './serviceWorker';
import { Switch, HashRouter, Route, Link, BrowserRouter as Router } from 'react-router-dom'
import ActionList from './action/ActionList';
import JobGroupList from './job/JobGroupList';
import zhCN from 'antd/lib/locale-provider/zh_CN';
ReactDOM.render(
    <HashRouter>
        <LocaleProvider locale={zhCN}>
            <App>
                <Route path="/actionlist" component={ActionList} />
                <Route path="/jobgrouplist" component={JobGroupList} />
            </App>
        </LocaleProvider>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
