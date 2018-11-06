import React, { Component } from 'react';
import { Table, Divider, Input, Button, Modal, message, Select, DatePicker } from 'antd';
import { Resizable } from 'react-resizable';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import { Link } from 'react-router-dom';
import StatusLabel from "../../constant/StatusLabel";
import moment from "moment";

const Option = Select.Option;
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

export default class JobGroupList extends Component {

    componentDidMount() {
        this.getFlowGroupList();
        this.getData(1);
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
        title: '状态',
        width: 100,
        render: (text, record) => (
            <span>{StatusLabel.getJobGroupStatus(record.status)}</span>
        )
    }, {
        title: '开始时间',
        width: 200,
        render: (text, record) => (
            // <span>{new Date(record.startTime).format('YYYYMMDD')}</span>
            <span>{moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
    }, {
        title: '结束时间',
        dataIndex: 'endTime',
        width: 200,
    }, {
        title: '用时',
        dataIndex: 'useTime',
        render: (text, record) => (
            <span>{StatusLabel.getUseTime(record.startTime, record.endTime)}</span>
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
                }}>详细</Link>
            </span>
        ),
    }];

    state = {
        name: '',
        className: '',
        flowGroupId: 0,
        loading: false,
        date: '',
        flowGroupList: [],
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


    setFlowGroupId(value) {
        console.log("value", value);
        this.setState({
            flowGroupId: value
        });
    }

    setDate(value) {
        var date = "";
        if (value != null) {
            date = value.format('YYYYMMDD');
        }
        this.setState({
            date: date
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


    getFlowGroupList() {
        Request
            .get('http://dev.gsralex.com:8080/api/flowgroup/select')
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.setState({
                            flowGroupList: res.body.data
                        });
                    }
                }
            })
    }

    getData(pageIndex) {
        this.setState({
            loading: true,
            pageIndex: pageIndex
        }, () => {
            Request
                .get('http://dev.gsralex.com:8080/api/jobgroup/list')
                .query('flowGroupId=' + this.state.flowGroupId)
                .query('date=' + this.state.date)
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
        const columns = this.columns.map((col, index) => ({
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
                        <span>流程组：</span>
                        <Select defaultValue="0" style={{ width: 120 }} onChange={this.setFlowGroupId.bind(this)}>
                            <Option value="0">请选择</Option>
                            {
                                this.state.flowGroupList.length && this.state.flowGroupList.map((item, index) => (
                                    <Option value={item.id}>{item.name}</Option>))
                            }
                        </Select>
                    </span>
                    <span style={{ marginRight: 20 }}>
                        <span>执行日期：</span>
                        <DatePicker onChange={this.setDate.bind(this)} />
                    </span>
                    <span>
                        <Button type="primary" onClick={() => this.getData(1)}>查询</Button>
                    </span>

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

