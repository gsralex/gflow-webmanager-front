import React, { Component } from 'react';
import { Table, Divider, Switch, Layout, Input, Button, Modal, message, Icon, Spin } from 'antd';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import Labels from './Labels'
import SaveTimerForm from './SaveTimer';
import { createStore } from 'redux'
import SaveOk from '../reducer/SaveReducer'
const store = createStore(SaveOk)


export default class TimerList extends Component {


    componentDidMount() {
        this.getData(1);
        store.subscribe(this.saveOk.bind(this));
    }

    saveOk() {
        if (store.getState() == 1) {
            this.setState({
                visible: false
            });
            this.getData(this.state.pageIndex);
        }
    }

    columns = [{
        title: 'id',
        dataIndex: 'id',
        width: 100,
    }, {
        title: '流程名',
        dataIndex: 'name',
        width: 100,
    }, {
        title: '流程id',
        dataIndex: 'flowGroupId',
        width: 100,
    }, {
        title: '类型',
        width: 100,
        render: (text, record) => (
            <span>{Labels.getTimeType(record.timeType, record.time, record.interval)}</span>
        )
    }, {
        title: '启用',
        width: 100,
        render: (text, record) => (
            <Switch checked={record.active} onChange={() => { this.updateActive(record.id) }} checkedChildren="启用" unCheckedChildren="禁用" />
        )
    }, {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => (
            <span>
                <a href="javascript:;" onClick={() => { this.showUpdate(record.id) }}>编辑</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={() => { this.showRemove(record.id, record.name) }}>删除</a>
            </span>
        ),
    }]

    state = {
        dataSource: {},
        id: 0,
        title: '',
        visible: false,
        pageSize: 30,
        pageIndex: 1,
        loading: false
    }

    showSave() {
        this.setState({
            id: 0,
            title: "添加Timer",
            visible: true
        });
    }

    hideSave() {
        this.setState({
            visible: false,
        });
    }

    showUpdate(id) {
        console.info("id", id);
        this.setState({
            id: id,
            title: '修改Timer',
            visible: true
        });

    }
    showRemove(id, name) {
        Modal.confirm({
            title: '确定要删除吗？',
            content: "id：" + id + "，名称：" + name,
            okText: '确认',
            cancelText: '取消',
            onOk: () => { this.remove(id) }
        });
    }

    remove(id) {
        Request
            .post('http://dev.gsralex.com:8080/api/timer/remove')
            .send('id=' + id)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        message.success("删除成功");
                        this.getData(this.state.pageIndex);
                    } else {
                    }
                }
            });
    }


    updateActive(id) {
        var active;
        for (var item of this.state.dataSource.data) {
            if (item.id == id) {
                item.active = !item.active;
                active = item.active;
            }
        }
        Request
            .post('http://dev.gsralex.com:8080/api/timer/updateActive')
            .send('id=' + id)
            .send('active=' + active)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        message.success("修改成功");
                    } else {
                    }
                }
            });
    }


    getData(pageIndex) {
        this.setState({
            loading: true,
            pageIndex: pageIndex
        },()=>{
            Request
            .get('http://dev.gsralex.com:8080/api/timer/list')
            .query('pageSize=' + this.state.pageSize)
            .query('pageIndex=' + this.state.pageIndex)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.setState({
                            dataSource: {
                                count: res.body.dataCnt,
                                data: res.body.data,
                                page: res.body.pageIndex
                            },
                            loading: false
                        });
                    } else {
                    }
                }
            });
        });
    }


    render() {
        const _this = this;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => { this.showSave() }}>添加+</Button>
                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onOk={this.hideSave.bind(this)}
                        onCancel={this.hideSave.bind(this)}
                        destroyOnClose={true}
                    >
                        <SaveTimerForm id={this.state.id}
                            store={store} />
                    </Modal>
                </div>
                <Table
                    bordered
                    components={this.components}
                    columns={this.columns}
                    dataSource={this.state.dataSource.data}
                    loading={this.state.loading}
                    pagination={{  //分页
                        total: this.state.dataSource.count, //数据总数量
                        current: this.state.pageIndex,//默认的当前页数
                        pageSize: this.state.pageSize,  //每页条数
                        defaultPageSize: this.state.pageSize, //默认的每页条数
                        showSizeChanger: true,  //是否显示可以设置几条一页的选项
                        onShowSizeChange(page, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                            _this.setState({
                                pageSize: pageSize
                            });
                            _this.getData(1);
                        },
                        onChange(page, pageSize) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                            _this.getData(page);
                        },
                        // showTotal: function () {  //设置显示一共几条数据
                        //     return '共 ' + this.state.dataSource.count + ' 条数据'; 
                        // }
                    }}
                />
            </div>

        )
    }
}
