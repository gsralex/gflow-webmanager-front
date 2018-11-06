import React, { Component } from 'react';
import { Table, Input, Button, Divider } from 'antd';
import StatusLabel from "../../constant/StatusLabel";
import { Link } from 'react-router-dom';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';

export default class FlowGroupList extends Component {

    // constructor(props, context) {
    //     super(props, context);
    //     this.context.router; // it works
    // }

    componentDidMount() {
        this.getData(1);
    }

    state = {
        name: '',
        dataSource: {},
        pageIndex: 1,
        pageSize: 30,
        loading: false
    }

    getData(pageIndex) {
        this.setState({
            loading: true,
            pageIndex: pageIndex
        }, () => {
            Request
                .get('http://dev.gsralex.com:8080/api/flowgroup/list')
                .query('name=' + this.state.name)
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

    showSave(){
        this.props.history.push("/saveflowgroup");
    }

    columns = [{
        title: 'id',
        dataIndex: 'id',
        width: 100,
    }, {
        title: '流程名称',
        dataIndex: 'name',
        width: 200,
    }, {
        title: '流程描述',
        dataIndex: 'description',
        width: 200,
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
                <Link to={{
                    pathname: "/jobgroupdetail",
                    query: { id: record.id }
                }}>编辑</Link>
                <Divider type="vertical" />
                <a href="javascript:;">删除</a>
            </span>
        ),
    }];

    render() {
        const _this = this;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 20 }}>
                        <span>名称：</span>
                        <Input style={{ width: 200 }} />
                    </span>
                    <span>
                        <Button type="primary" onClick={() => this.getData(1)}>查询</Button>
                    </span>

                </div>

                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => { this.showSave() }}>添加+</Button>
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
                        showSizeChanger: true,  //是否显示可以设置几条一页的选项
                        onShowSizeChange(page, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                            _this.setState({
                                pageSize: pageSize
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
        )
    }
}