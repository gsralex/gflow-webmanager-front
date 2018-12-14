import React, { Component } from 'react';
import { Layout, Divider, List, Input, Spin, Button, Drawer, message } from 'antd';
import { Card } from 'antd';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import InfiniteScroll from 'react-infinite-scroller';
import Flow from '../../components/flowset';
import styles from './index.css';
import RequestUtils from '../../util/RequestUtils';
import RectContants from '../../constant/RectContants';

const { Header, Content, Footer, Sider } = Layout;

export default class SaveFlowGroup extends Component {

    componentDidMount() {
        console.log("style:", styles);
        var id = RequestUtils.getParameter(this.props.location.search, "id");
        if (id != null && id > 0) {
            this.id = id;
            this.getFlowGroup();
        }
        // console.log(this.props.match.location.search);
        this.getActionList();
        document.addEventListener('mouseup', this.pageMouseUp.bind(this));
        document.addEventListener('mousemove', this.pageMouseMove.bind(this));
        this.setState({
            flowHeight: document.body.clientHeight - 140
        })
    }

    state = {
        name: "",
        description: "",
        flows: [],
        flowGroup: null,
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

    saving = false;
    moving = false;
    x = 0;
    y = 0;
    actionId = 0;
    isEnterFlow = false;
    id = 0;
    actionMouseDown(e, id, name, className) {
        if (e.button != 0) {
            return;
        }
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
            var svg2 = document.getElementById('flow-group');
            var rect = svg2.getBoundingClientRect();
            var x = e.pageX - rect.x - RectContants.ACTION_WIDTH / 2;
            var y = e.pageY - rect.y - RectContants.ACTION_HEIGHT / 2;
            this.setState({
                // actionStyle:{'background':'b'}
                actionStyle: { 'display': 'block', 'transform': 'translate(' + x + 'px,' + y + 'px)' }
            });
        }
        e.stopPropagation();//取消冒泡
    }

    pageMouseUp(e) {
        if (this.moving) {
            this.moving = false;
            console.log("pageMouseUp");
            console.log("pageX:" + e.pageX + ",pageY:" + e.pageY);

            var svg2 = document.getElementById('svg2');
            var rect = svg2.getBoundingClientRect();
            var x = e.pageX - rect.x - RectContants.ACTION_WIDTH / 2;
            var y = e.pageY - rect.y - RectContants.ACTION_HEIGHT / 2;
            this.flow.createAction(0, x, y, this.actionId, -1, this.state.selected.name, this.state.selected.className);
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
            .get('http://127.0.0.1:8080/api/action/list')
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
            });
    }

    getFlowGroup() {
        Request
            .get("http://127.0.0.1:8080/api//flowgroup/get")
            .query("id=" + this.id)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.setState({
                            name: res.body.data.name,
                            description:res.body.data.description,
                            flowGroup: res.body.data
                        });
                    }
                }
            })
    }

    save() {
        var map = this.flow.getFlowMap();
        var input = {
            id: this.id,
            name: this.state.name,
            description:this.state.description,
            startX: map.startX,
            startY: map.startY,
            list: map.list
        };
        Request
            .post('http://127.0.0.1:8080/api/flowgroup/save')
            .set('Content-Type', 'application/json')
            .send(input)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.id = res.body.data;
                        message.success("保存成功");
                    } else {
                        message.error("保存失败");
                    }
                }
            });
    }

    setName(e) {
        this.setState({ name: e.target.value });
    }
    setDescription(e) {
        this.setState({ description: e.target.value });
    }

    render() {
        const _this = this;
        return (
            <div id="flow-group" className="flow-group" style={{ height: this.state.flowHeight }}>
                <div style={this.state.actionStyle} id="action-helper" className="action-helper">
                    <div style={{ textAlign: "center" }}>{this.state.selected.name}</div>

                </div>
                <div className="action-list">
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
                <div className="flow-wrap" >
                    <Input placeholder="请输入流程名称" style={{ width: '150px', margin: '0 10px 0 0' }} value={this.state.name} onChange={this.setName.bind(this)}></Input>
                    <Input placeholder="请输入流程描述" style={{ width: '300px', margin: '0 10px 0 0' }}  value={this.state.description} onChange={this.setDescription.bind(this)}></Input>
                    <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
                    <div className="flow" style={{ height: this.state.flowHeight - 30 }}>
                        <Flow onRef={this.onRef} edit={false} flowGroup={this.state.flowGroup} />
                    </div>
                </div>
            </div>
        )
    }
}