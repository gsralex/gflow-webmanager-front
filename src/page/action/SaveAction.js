import React, { Component } from 'react';
import { Form, Input, Select, message, Button } from 'antd';
import Request from 'superagent';

import RepCode from '../../constant/RepCodeContants';
const FormItem = Form.Item;
const Option = Select.Option;

class SaveAction extends Component {

    id = 0;
    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
        this.getActionTag();
        this.id = this.props.id;
        if (this.id > 0) {
            this.getData();
        }
    }

    state = {
        actionTags: []
    }

    getData() {
        Request
            .get(RepCode.URL+'/api/action/get')
            .query('id=' + this.id)
            .end((err, res) => {
                if (res.body.code == RepCode.CODE_OK) {
                    let data = res.body.data;
                    this.props.form.setFieldsValue({
                        name: data.name,
                        className: data.className,
                        tagId:data.tagId
                    });
                }
            });
    }

    getActionTag() {
        Request
            .get(RepCode.URL+"/api/actiontag/list")
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



    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Request
                    .post(RepCode.URL+'/api/action/save')
                    .send('name=' + values.name)
                    .send('className=' + values.className)
                    .send("tagId="+values.tagId)
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
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, resetFields } = this.props.form;

        // const { form: { validateFields } } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 15 },
                sm: { span: 15 },
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
                    label="名称"
                >

                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入action名称' }],
                    })(
                        <Input />
                    )}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="类名"
                >
                    {getFieldDecorator('className', {
                        rules: [{ required: true, message: '请输入类名' }],
                    })(
                        <Input placeholder="例如:com.gsralex.gflow.DemoProcess" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="标签id"
                >
                    {getFieldDecorator('tagId', {
                        initialValue: 0,
                        rules: [{ required: true, message: '请选择action标签' }],
                    })(
                        <Select defaultValue={0}>
                            <Option value={0}>请选择</Option>
                            {this.state.actionTags.map(action => <Option value={action.id}>{action.name}</Option>)}
                        </Select>
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        );
    }
}
const SaveActionForm = Form.create()(SaveAction);
export default SaveActionForm;
