import React, { Component } from 'react';
import { Layout, Divider, List, Input, Spin } from 'antd';
import { Card } from 'antd';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import InfiniteScroll from 'react-infinite-scroller';
import Flow from '../../components/flowset';
import styles from './index.css';


const { Header, Content, Footer, Sider } = Layout;

export default class SaveFlowGroup extends Component {

    componentDidMount() {
        console.log("style:", styles);
        this.getActionList();
        document.addEventListener('mouseup', this.pageMouseUp.bind(this));
        document.addEventListener('mousemove', this.pageMouseMove.bind(this));
    }

    state = {
        selected: {},
        actionPos: {
            x: 0,
            y: 0
        },
        actionStyle: { 'display': 'none' },
        actionQuery: '',
        actionList: {
            data: []
        },
        flowStyle: {},
        loading: false,
        hasMore: true,
        pageSize: 30,
        pageIndex: 1
    }

    moving = false;
    x = 0;
    y = 0;
    isEnterFlow = false;
    actionMouseDown(e, id, name, className) {
        console.log("e", e);
        this.moving = true;
        console.log("x:", e.pageX + ",y:", e.pageY)
        this.x = e.pageX;
        this.y = e.pageY;
        console.log("actionMouseDown");
        this.setState({
            selected: {
                id: id,
                name: name,
                className: className
            }
        });
    }

    onRef = (ref) => {
        this.flow = ref;
    }

    pageMouseMove(e) {
        if (this.moving) {
            console.log("pageMouseMove");
            var moveX = e.pageX - 100;
            var moveY = e.pageY - 100;
            this.setState({
                // actionStyle:{'background':'b'}
                actionStyle: { 'display': 'block', 'transform': 'translate(' + moveX + 'px,' + moveY + 'px)' }
            });
        }
    }

    pageMouseUp(e) {
        if (this.moving) {
            this.moving = false;
            console.log("pageMouseUp");
            console.log("pageX:" + e.pageX + ",pageY:" + e.pageY);
            this.flow.createAction(e.pageX, e.pageY, '', '');
            this.setState({
                actionStyle: { 'display': 'none' }
            });
        }
    }

    enterFlow(e) {
        if (this.moving) {
            this.isEnterFlow = true;
            this.setState({
                flowStyle: { 'border-color': 'blue' }
            });
        }
    }

    outFlow(e) {
        if (this.moving) {
            this.isEnterFlow = false;
            this.setState({
                flowStyle: { 'border-color': '#ff0' }
            });
        }
    }

    actionQueryChange(e) {
        this.setState({
            actionQuery: e.target.value
        }, () => {
            this.getActionList();
        });
    }

    getActionMore() {
        this.setState({
            loading: true
        });
        this.getActionData((data) => {
            var loadedData = this.state.actionList.data;
            loadedData.concat(data);
            var hasMore = true;
            if (loadedData.length >= data.count) {
                hasMore = false;
            }

            this.setState({
                loading: false,
                actionList: {
                    data: loadedData,
                    count: data.count,
                    hasMore: hasMore
                }
            });
        });

    }

    getActionList() {
        this.setState({
            loading: true
        });
        this.getActionData((data) => {
            console.log("getActionList", data);
            this.setState({
                actionList: {
                    data: data.data,
                    count: data.count
                }
            });
        });
        this.setState({
            loading: false,
        });
    }

    getActionData(callback) {
        Request
            .get('http://dev.gsralex.com:8080/api/action/list')
            .query('className=' + this.state.actionQuery)
            .query('pageSize=' + this.state.pageSize)
            .query('pageIndex=' + this.state.pageIndex)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        callback({
                            count: res.body.dataCnt,
                            data: res.body.data,
                            page: res.body.pageIndex
                        });
                    } else {

                    }
                }
                return null;
            });
    }

    render() {
        const _this = this;
        return (
            <div className="flowGroup">
                <div style={this.state.actionStyle} className="actionHelper">
                    <div>{this.state.selected.id} {this.state.selected.name}</div>
                    <div>{this.state.selected.className}</div>
                </div>
                <div className="actionList" style={{ 'overflow': '' }}>
                    <Input placeholder="输入action名称或者class" value={this.state.actionQuery} onChange={this.actionQueryChange.bind(this)} />
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={1}
                        loadMore={this.getActionMore}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                    >  <List
                            bordered={false}
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={this.state.actionList.data}
                            renderItem={item => (
                                <List.Item onMouseDown={(e) => this.actionMouseDown(e, item.id, item.name, item.className)}>
                                    <div className="action">
                                        <div> {item.id} {item.name}</div>
                                        <div> {item.className}</div>
                                    </div>
                                </List.Item>
                            )}
                        />
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </InfiniteScroll>
                </div>
                <div className="flow" style={this.state.flowStyle} onMouseOver={(e) => this.enterFlow(e)} onMouseOut={(e) => this.outFlow(e)}>
                    <Flow onRef={this.onRef} edit={false} />
                </div>
            </div>
        )
    }
}