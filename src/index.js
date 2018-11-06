import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { LocaleProvider,Icon,Spin } from 'antd';
import * as serviceWorker from './serviceWorker';
import { Switch, HashRouter, Route, Link, BrowserRouter as Router } from 'react-router-dom'
import ActionList from './page/action/ActionList';
import JobGroupList from './page/job/JobGroupList';
import JobGroupDetail from './page/job/JobGroupDetail';
import FlowGroupList from './page/flow/FlowGroupList';
import SaveFlowGroup from './page/flow/SaveFlowGroup';
import TimerList from './page/timer/TimerList';
import SaveTimer from './page/timer/SaveTimer';
import zhCN from 'antd/lib/locale-provider/zh_CN';


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
Spin.setDefaultIndicator(antIcon);
ReactDOM.render(
    <HashRouter>
        <LocaleProvider locale={zhCN}>
            <App>
                <Route path="/actionlist" component={ActionList} />
                <Route path="/jobgrouplist" component={JobGroupList} />
                <Route path="/jobgroupdetail" component={JobGroupDetail} />
                <Route path="/flowgrouplist" component={FlowGroupList} />
                <Route path="/saveflowgroup" component={SaveFlowGroup} />
                <Route path="/timerlist" component={TimerList} />
                <Route path="/savetimer" component={SaveTimer} />
            </App>
        </LocaleProvider>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
