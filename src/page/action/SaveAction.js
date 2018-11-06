import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, message, Button, AutoComplete } from 'antd';
import Request from 'superagent';

import RepCode from '../../constant/RepCodeContants';
const FormItem = Form.Item;


class SaveAction extends Component {

    id = 0;
    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
        this.id = this.props.id;
        if (this.id > 0) {
            this.getData();
        }
    }

    getData() {
        Request
            .get('http://dev.gsralex.com:8080/api/action/get')
            .query('id=' + this.id)
            .end((err, res) => {
                if (res.body.code == RepCode.CODE_OK) {
                    let data = res.body.data;
                    this.props.form.setFieldsValue({
                        name: data.name,
                        className: data.className
                    });
                }
            });
    }



    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Request
                    .post('http://dev.gsralex.com:8080/api/action/save')
                    .send('name=' + values.name)
                    .send('className=' + values.className)
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

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        );
    }
}
const SaveActionForm = Form.create()(SaveAction);
export default SaveActionForm;
