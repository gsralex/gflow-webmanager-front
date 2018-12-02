import React, { Component } from 'react';
import { Layout, Divider, List, Input, Spin, Button, Drawer } from 'antd';
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
        this.setState({
            flowHeight: document.body.clientHeight - 140
        })
    }

    state = {
        flowGroupName: "",
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
        pageIndex: 1,
        flowHeight: 0
    }

    moving = false;
    x = 0;
    y = 0;
    actionId = 0;
    isEnterFlow = false;
    actionMouseDown(e, id, name, className) {
        console.log("e", e);
        this.moving = true;
        this.x = e.pageX;
        this.y = e.pageY;
        this.actionId = id;
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
        e.stopPropagation();//取消冒泡
    }

    pageMouseUp(e) {
        if (this.moving) {
            this.moving = false;
            console.log("pageMouseUp");
            console.log("pageX:" + e.pageX + ",pageY:" + e.pageY);
<<<<<<< HEAD
            this.flow.createAction(e.pageX, e.pageY, this.actionId, this.state.selected.name, '');
=======
            this.flow.createAction(e.pageX, e.pageY, this.actionId, this.state.selected.name, this.state.selected.className);
>>>>>>> a14b0b1bb0fa65273f53fb7c479a2eb246081fe3
            this.setState({
                actionStyle: { 'display': 'none' }
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
            loading: true,
            pageIndex: this.state.pageIndex + 1
        });
        this.getActionData((rsp) => {
            var loadedData = this.state.actionList.data;
            loadedData = loadedData.concat(rsp.data);
            var hasMore = true;
            console.log(loadedData.length, ",", rsp.count);
            if (loadedData.length >= rsp.count) {
                hasMore = false;
            }

            this.setState({
                loading: false,
                actionList: {
                    data: loadedData
                },
                hasMore: hasMore
            });
        });

    }

    getActionList() {
        this.setState({
            loading: true
        });
        this.getActionData((rsp) => {
            console.log("getActionList", rsp);
            this.setState({
                actionList: {
                    data: rsp.data,
                    count: rsp.count
                }
            });
        });
        this.setState({
            loading: false,
        });
    }


    getActionData(callback) {
        Request
            .get('http://localhost:8080/api/action/list')
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

    saveFlowGroup() {
        console.log("save");
        var map= this.flow.getFlowMap();
        console.log(map);
        var input={
            name:this.state.flowGroupName,
            list:map
        };
        console.log(input);
        Request
            .post('http://localhost:8080/api/flowgroup/save')
            .set('Content-Type', 'application/json')
            .send(input)
            .end((err, res) => {
                if (!err) {
                    // if (res.body.code == RepCode.CODE_OK) {
                        
                    // } else {

                    // }
                }
                return null;
            });

    }

    setFlowGroupName(e) {
        this.setState({ flowGroupName: e.target.value });
    }

    render() {
        const _this = this;
        return (
            <div className="flowGroup" style={{ height: this.state.flowHeight }}>
                <div style={this.state.actionStyle} className="actionHelper">
                    <div>{this.state.selected.id} {this.state.selected.name}</div>
                    <div>{this.state.selected.className}</div>
                </div>
                <div className="actionList">
                    <Input placeholder="输入action名称或者class" value={this.state.actionQuery} onChange={this.actionQueryChange.bind(this)} />
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={1}
                        loadMore={this.getActionMore.bind(this)}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                    >  <List
                            bordered={false}
                            className="demo-loadmore-list"
                            itemLayout="hƒorizontal"
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
                <div className="flowWrap" >
                    <Input placeholder="请输入流程名称" value={this.state.flowGroupName} onChange={this.setFlowGroupName.bind(this)}></Input>
                    <Button type="primary" onClick={this.saveFlowGroup.bind(this)}>Primary</Button>
                    <div className="flow" style={{ height: this.state.flowHeight - 30 }}>
                        <Flow onRef={this.onRef} edit={false} />
                    </div>
                </div>


                {/* <Drawer
                        title="Basic Drawer"
                        placement="right"
                        closable={true}
                        onClose={true}
                        visible={true}
                        destroyOnClose={true}
                        placement="right"
                        >
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                </Drawer> */}
            </div>
        )
    }
}