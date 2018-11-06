import React, { Component } from 'react';
import { Card, Row, Col, Table, Divider, Input, Button, Modal, message, Tabs, Layout } from 'antd';
import styles from './index.less';
import DescriptionList from '../../components/DescriptionList'
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import { Record } from 'immutable';
import moment from "moment";
import StatusLabel from "../../constant/StatusLabel"

const { Description } = DescriptionList;

const TabPane = Tabs.TabPane;

export default class JobGroupDetail extends Component {

    id;
    columns = [{
        title: 'id',
        dataIndex: 'id',
        width: 100,
    }, {
        title: '名称',
        width: 200,
        render: (text, record) => (
            // <span>{new Date(record.startTime).format('YYYYMMDD')}</span>
            <span title={record.className}>{record.name}</span>
        )
    }, {
        title: '开始时间',
        width: 200,
        render:(text,record)=>(
            <span>{moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
    }, {
        title:'结束时间',
        width:200,
        render:(text,record)=>(
            <span>{moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
    },{
        title:'用时',
        width:100,
        render:(text,record)=>(
            <span>{StatusLabel.getUseTime(record.startTime,record.endTime)}</span>
        )

    },{
        title: '状态',
        render:(text,record)=>(
            <span>{StatusLabel.getJobStatus(record.status)}</span>
        )
    }];
    state = {
        jobGroup: null,
        jobGroup: {},
        jobList:[]
    }

    componentDidMount() {
        console.log("props",this.props);
        this.id = this.props.location.query.id;
        console.log("id", this.id);
        if (this.id > 0) {
            this.getData();
            this.getJobData();
        }  
    }


    getData() {
        Request
            .get('http://dev.gsralex.com:8080/api/jobgroup/get')
            .query('id=' + this.id)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.setState({
                            jobGroup: res.body.data
                        });
                    } else {
                    }
                }
            });
    }

    getJobData() {
        Request
            .get('http://dev.gsralex.com:8080/api/job/list')
            .query('jobGroupId=' + this.id)
            .end((err, res) => {
                if (!err) {
                    if (res.body.code == RepCode.CODE_OK) {
                        this.setState({
                            jobList: res.body.data
                        });
                    } else {
                    }
                }

            });
    }

    tabChange() {

    }

    render() {
        return (
            <div>
                <Card bordered={false}>
                    <DescriptionList size="large" title="job组详细" style={{ marginBottom: 10 }}>
                        <Description term="取货单号">1000000000</Description>
                        <Description term="状态">已取货</Description>
                        <Description term="销售单号">1234123421</Description>
                        <Description term="子订单">3214321432</Description>
                    </DescriptionList>
                    <DescriptionList size="large" title="job组详细" style={{ marginBottom: 10 }}>
                        <Description term="取货单号">1000000000</Description>
                        <Description term="状态">已取货</Description>
                        <Description term="销售单号">1234123421</Description>
                        <Description term="子订单">3214321432</Description>
                    </DescriptionList>
                </Card>
                <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                    <TabPane tab="列表" key="1">
                        <Table
                            columns={this.columns}
                            dataSource={this.state.jobList}
                            pagination={false}
                        // loading={this.state.loading}
                        />

                    </TabPane>
                    <TabPane tab="图例" key="2">Content of Tab Pane 2</TabPane>
                </Tabs>
            </div>
        )
    }

}