import React, { Component } from 'react';
import { Form, TimePicker, Switch, Select, message, Button, Row, Col, Layout } from 'antd';
import Request from 'superagent';
import RepCode from '../../constant/RepCodeContants';
import moment from "moment";
const FormItem = Form.Item;

const Option = Select.Option;
class SaveTimer extends Component {

    id = 0;
    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
        this.id = this.props.id;
        if (this.id > 0) {
            this.getData();
        }
        this.getFlowGroupList();
    }

    state = {
        flowGroupList: [],
        checked: true
    }

    getData() {
        Request
            .get('http://dev.gsralex.com:8080/api/timer/get')
            .query('id=' + this.id)
            .end((err, res) => {
                if (res.body.code == RepCode.CODE_OK) {
                    let data = res.body.data;
                    this.props.form.setFieldsValue({
                        flowGroupId: data.flowGroupId,
                        timeType: data.timeType.toString(),
                        time: moment(data.time, 'HH:mm:ss'),
                        active: data.active
                    });
                    this.setState({
                        checked: data.active
                    })
                }
            });
    }

    getFlowGroupList() {
        Request
            .get('http://dev.gsralex.com:8080/api/flowgroup/select')
            .end((err, res) => {
                this.setState({
                    flowGroupList: res.body.data
                })
            })
    }


    validateFlowGroupId = (rule, value, callback) => {
        const form = this.props.form;
        console.log("flowGroupId:", value);
        if (value > 0) {
            callback();
        } else {
            callback('请选择');
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values.active);
                Request
                    .post('http://dev.gsralex.com:8080/api/timer/save')
                    .send('flowGroupId=' + values.flowGroupId)
                    .send('timeType=' + values.timeType)
                    .send('time=' + moment(values.time).format("HH:mm:ss"))
                    .send('active=' + values.active)
                    .send('id=' + this.id)
                    .end((err, res) => {
                        if (!err) {
                            if (res.body.code == RepCode.CODE_OK) {
                                message.success("保存成功");
                                this.props.store.dispatch({ type: 'saveOk' });
                            } else {
                                message.error(res.body.msg);
                            }
                        }

                    });
            }
        });
        // console.log(this.props.form)
    }

    render() {
        const time = moment("00:00:00", "HH:mm:ss");
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, resetFields } = this.props.form;

        // const { form: { validateFields } } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 20,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 5,
                },
            },
        };
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="流程组id"
                >
                    {getFieldDecorator('flowGroupId', {
                        initialValue: '0',
                        rules: [{ required: true, message: '请选择流程组id' },
                        {
                            validator: this.validateFlowGroupId,
                        }],

                    })(
                        <Select defaultValue="0" style={{ width: 120 }}>
                            <Option value="0">请选择</Option>
                            {
                                this.state.flowGroupList.length && this.state.flowGroupList.map((item, index) => (
                                    <Option value={item.id}>{item.name}</Option>))
                            }
                        </Select>
                    )}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="类型"
                >
                    <Row>
                        <Col>
                            {getFieldDecorator('timeType', {
                                initialValue: '1',
                                rules: [{ required: true, message: '请选择类型' }],
                            })(
                                <Select defaultValue="1" style={{ width: 120 }} onChange={this.timeTypeChange}>
                                    <Option value="1">定时</Option>
                                </Select>
                            )}
                        </Col>
                        <Col>
                            {getFieldDecorator('time', {
                                initialValue: time,
                                rules: [{ required: true, message: '请输入定时时间' }],
                            })(
                                <TimePicker defaultValue={time} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="启用"
                >
                    {getFieldDecorator('active', {
                        initialValue: false,
                        valuePropName: 'checked',
                    })(
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        );
    }
}
const SaveTimerForm = Form.create()(SaveTimer);
export default SaveTimerForm;
