import React, { Component } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { Form, Input,  Select, message, Button } from 'antd';
import Request from 'superagent';

import RepCode from '../../constant/RepCodeContants';
const FormItem = Form.Item;

class SaveActionTag extends Component {
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
            .get('http://127.0.0.1:8080/api/actiontag/get')
            .query('id=' + this.id)
            .end((err, res) => {
                if (res.body.code == RepCode.CODE_OK) {
                    let data = res.body.data;
                    this.props.form.setFieldsValue({
                        name: data.name,
                        servers: data.servers
                    });
                }
            });
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Request
                    .post('http://127.0.0.1:8080/api/actiontag/save')
                    .send('name=' + values.name)
                    .send('servers=' + values.servers)
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
                        rules: [{ required: true, message: '请输入标签组名称' }],
                    })(
                        <Input />
                    )}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务器列表"
                >
                    {getFieldDecorator('servers', {
                        rules: [{ required: true, message: '请输入服务器列表' }],
                    })(
                       <TextArea style={{height:'150px'}} placeholder="例如:127.0.0.1:8080,127.0.0.1:8081"></TextArea>
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        );
    }
}


const SaveActionTagForm = Form.create()(SaveActionTag);
export default SaveActionTagForm;