import React, { Component } from 'react';
import { Card, Row, Col, Table, Divider, Input, Button, Modal, message, Tabs, Layout } from 'antd';
import styles from './index.less';
import DescriptionList from '../../components/DescriptionList'
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import { Record } from 'immutable';
import moment from "moment";
import StatusLabel from "../../constant/StatusLabel"
import RequestUtils from '../../util/RequestUtils';

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
            <span>{StatusLabel.formatTime(record.endTime)}</span>
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
    },{
        title: '参数',
        dataIndex: 'parameter'
    }];
    state = {
        jobGroup: null,
        jobGroup: {},
        jobList:[]
    }

    componentDidMount() {
        console.log("props",this.props);
        this.id = RequestUtils.getParameter(this.props.location.search, "id");
        if (this.id != null && this.id > 0) {
            this.getData();
            this.getJobData();
        }
    }


    getData() {
        Request
            .get(RepCode.URL+'/api/jobgroup/get')
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
            .get(RepCode.URL+'/api/job/list')
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
                    <DescriptionList size="large" title="流程组详细" col="4" style={{ marginBottom: 20}}>
                        <Description term="流程组id">{this.state.jobGroup.id}</Description>
                        <Description term="流程名称">{this.state.jobGroup.name}</Description>
                        <Description term="流程描述">{this.state.jobGroup.description}</Description>
                        <Description term="状态">{StatusLabel.getJobGroupStatus(this.state.jobGroup.status)}</Description>
                        <Description term="参数">{this.state.jobGroup.parameter}</Description>
                        <Description term="开始时间">{StatusLabel.formatTime(this.state.jobGroup.startTime)}</Description>
                        <Description term="结束时间">{StatusLabel.formatTime(this.state.jobGroup.endTime)}</Description>
                        <Description term="用时">{StatusLabel.getUseTime(this.state.jobGroup.startTime, this.state.jobGroup.endTime)}</Description>
                    
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