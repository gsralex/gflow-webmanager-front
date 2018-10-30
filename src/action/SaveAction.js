import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, message, Button, AutoComplete } from 'antd';
import ReactDOM from 'react-dom';
import Request from 'superagent';

import RepCode from '../constant/RepCodeContants';
import { link } from 'fs';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class SaveAction extends Component {
    state={
        ok:false
    }


    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
        let id = this.props.id;
        console.log(id);
    }



    handleSubmit = (e) => {
        e.preventDefault();
        const _this=this;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Request
                    .post('http://dev.gsralex.com:8080/api/action/save')
                    .send('name=' + values.name)
                    .send('className=' + values.className)
                    .end((err, res) => {
                        if (!err) {
                            if (res.body.code == RepCode.CODE_OK) {
                                message.success("保存成功");
                                this.state.ok=true;
                                _this.props.toParent(this.state.ok);
                                //this.props.history.push("/actionlist");

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
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

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
                    span: 10,
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
