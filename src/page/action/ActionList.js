import React, { Component } from 'react';
import { Table, Divider, Layout, Input, Button, Modal, message, Icon, Spin, Select } from 'antd';
import { Resizable } from 'react-resizable';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import SaveActionForm from './SaveAction';
import { createStore } from 'redux'
import SaveOk from '../reducer/SaveReducer'
import StatusLabel from "../../constant/StatusLabel"
const Option = Select.Option;

const store = createStore(SaveOk)
const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
};

export default class ActionList extends Component {

    componentDidMount() {
        this.getData(1);
        this.getActionTag();
        store.subscribe(this.saveActionOk.bind(this));
    }

    saveActionOk() {
        if (store.getState() == 1) {
            this.setState({
                visible: false
            });
            this.getData(1);
        }
    }


    showUpdate(id) {
        this.setState({
            id: id,
            title: '修改Action',
            visible: true
        });

    }
    showRemove(id, name, className) {
        Modal.confirm({
            title: '确定要删除吗？',
            content: "id：" + id + "，名称：" + name + " 类名：" + className,
            okText: '确认',
            cancelText: '取消',
            onOk: () => { this.remove(id) }
        });
    }
    remove(id) {
        Request
            .post('http://127.0.0.1:8080/api/action/remove')
            .send('id=' + id)
            .end((err, res) => {
                if (res.body.code == RepCode.CODE_OK) {
                    message.success("删除成功");
                    this.getData(this.state.pageIndex);
                }
            });
    }

    state = {
        id: 0,
        title: '',
        visible: false,
        name: '',
        className: '',
        tagId:0,
        loading: false,
        actionTags: [],
        columns: [{
            title: 'id',
            dataIndex: 'id',
            width: 100,
        }, {
            title: '名称',
            dataIndex: 'name',
            width: 100,
        }, {
            title: '类名',
            dataIndex: 'className',
            width: 300,
        },{
            title: 'tagId',
            dataIndex: 'tagName',
            width: 100,
        }, {
            title: '创建时间',
            width: 100,
            render: (text, record) => (
                <span>{StatusLabel.formatTime(record.createTime)}</span>
            )
        }, {
            title: '修改时间',
            width: 100,
            render: (text, record) => (
                <span>{StatusLabel.formatTime(record.modTime)}</span>
            )
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => { this.showUpdate(record.id) }}>编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => { this.showRemove(record.id, record.name, record.className) }}>删除</a>
                </span>
            ),
        }],
        dataSource: {},
        pageSize: 30,
        pageIndex: 1
    };

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };


    setName(e) {
        this.setState({ name: e.target.value });
    }

    setClassName(e) {
        this.setState({ className: e.target.value });
    }

    setTagId(value){
        this.setState({ tagId: value });
    }

    showSave() {
        this.setState({
            id: 0,
            title: "添加Action",
            visible: true
        });
    }

    hideSave() {
        this.setState({
            visible: false,
        });
    }


    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };


    getActionTag() {
        Request
            .get("http://127.0.0.1:8080/api/actiontag/list")
            .query("pageSize=100")
            .query("pageIndex=1")
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        console.log("data", res.body.data);
                        this.setState({
                            actionTags: res.body.data
                        });
                    }
                }
            });
    }

    getData(pageIndex) {
        console.log("pageIndex", pageIndex);
        this.setState({
            loading: true,
            pageIndex: pageIndex
        }, () => {
            Request
                .get('http://127.0.0.1:8080/api/action/list')
                .query('name=' + this.state.name)
                .query('className=' + this.state.className)
                .query('tagId='+this.state.tagId)
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
                        }
                    } else {
                        message.error("请求失败");
                        this.setState({
                            loading: false
                        });
                    }
                });
        });

    }

    render() {
        const _this = this;
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));

        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 20 }}>
                        <span>tagid：</span>
                        <Select defaultValue={0} value={this.state.tagId} onChange={this.setTagId.bind(this)}>
                            <Option value={0}>请选择</Option>
                            {this.state.actionTags.map(action => <Option value={action.id}>{action.name}</Option>)}
                        </Select>
                    </span>
                    <span style={{ marginRight: 20 }}>
                        <span>名称：</span>  <Input placeholder="请输入名称" value={this.state.name} onChange={this.setName.bind(this)} style={{ width: 200 }} /></span>
                    <span style={{ marginRight: 20 }}>
                        <span>类名：</span>  <Input placeholder="请输入类名" value={this.state.className} onChange={this.setClassName.bind(this)} style={{ width: 200 }} />
                    </span>
                    <span>
                        <Button type="primary" onClick={() => this.getData(1)}>查询</Button>
                    </span>

                </div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => { this.showSave() }}>添加+</Button>
                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onOk={this.hideSave.bind(this)}
                        onCancel={this.hideSave.bind(this)}
                        destroyOnClose={true}
                        footer={false}
                    >
                        <SaveActionForm id={this.state.id}
                            store={store} />
                    </Modal>
                </div>

                <Table
                    bordered
                    components={this.components}
                    columns={columns}
                    dataSource={this.state.dataSource.data}
                    loading={this.state.loading}
                    pagination={{  //分页
                        total: this.state.dataSource.count, //数据总数量
                        current: this.state.pageIndex,//默认的当前页数
                        pageSize: this.state.pageSize,  //每页条数
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
        );
    }
}

