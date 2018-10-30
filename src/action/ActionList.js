import React, { Component } from 'react';
import { Table, Divider, Layout, Input, Button, Modal } from 'antd';
import { Resizable } from 'react-resizable';
import Request from 'superagent';
import RepCode from '../constant/RepCodeContants';
import { Link } from 'react-router-dom'
import { Record } from 'immutable';
import SaveActionForm from './SaveAction';
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

export default class Demo extends Component {

    state = {
        ok: false,
        visible: false,
        name: '',
        className: '',
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
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 100,
        }, {
            title: '修改时间',
            dataIndex: 'modTime',
            width: 100,
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <span>
                    <Link to={{
                        pathname: "/saveaction?id=" + record.id,

                    }}>编辑</Link>
                    <Divider type="vertical" />
                    <a href="javascript:;">删除</a>
                </span>
            ),
        }],
        dataSource: {},
        queryInfo: {
            pageSize: 30
        }
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

    showSave() {
        this.setState({ visible: true });
    }

    hideSave() {
        this.setState({
            visible: false,
        });
    }

    saveOk(ok) {
        alert(1);
        this.setState({
            ok: ok,
        });
        if (ok) {
            this.hideSave();
        }
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

    componentDidMount() {
        this.getData(1);
    }

    getData = (pageIndex) => {
        Request
            .get('http://dev.gsralex.com:8080/api/action/list')
            .query('name=' + this.state.name)
            .query('className=' + this.state.className)
            .query('pageSize=' + this.state.queryInfo.pageSize)
            .query('pageIndex=' + pageIndex)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.setState({
                            dataSource: {
                                count: res.body.dataCnt,
                                data: res.body.data,
                                page: res.body.pageIndex
                            },
                        });
                    } else {
                    }
                }

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
                        title="Modal"
                        visible={this.state.visible}
                        onOk={this.hideSave}
                        onCancel={this.hideSave}
                        toParent={this.saveOk.bind(this)}
                    >
                        <SaveActionForm id={1} />
                    </Modal>
                </div>
                <Table
                    bordered
                    components={this.components}
                    columns={columns}
                    dataSource={this.state.dataSource.data}
                    pagination={{  //分页
                        total: this.state.dataSource.count, //数据总数量
                        pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                        defaultPageSize: this.state.queryInfo.pageSize, //默认显示几条一页
                        showSizeChanger: true,  //是否显示可以设置几条一页的选项
                        onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                            _this.setState({
                                queryInfo: {
                                    pageSize: pageSize
                                }
                            });
                            _this.getData(1); //这边已经设置了self = this
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

