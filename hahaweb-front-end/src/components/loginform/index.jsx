import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import './index.css';
import api from '../../api';

const FormItem = Form.Item;

class BasicLogin extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((errs, values) => {
      if (!errs && values) {
        const body = {
          authorizationCode: values.authorizationCode,
          phoneNumber: values.phoneNumber.slice(11)
        };

        const bodyEncode = new URLSearchParams();
          Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.login, {
          method: 'POST',
          body: bodyEncode,
          mode: 'cors'
        })
        .catch(err => {
            message.error('request error!');
            this.props.form.resetFields();
        })
        .then(res => res.json())
        .then(res => {
            if(res['status']) {
              message.success('login successfully!');
              window.localStorage.setItem('authorizationCode', values.authorizationCode);
              window.setTimeout(() => {
                this.props.history.push('/instruction');  
              }, 200);
            } else {
              message.error(res['message']);
              this.props.form.resetFields();
            }
        });
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <p className="login-form-title">QIndomitable Old Book System</p>
            <FormItem>
              {getFieldDecorator('authorizationCode', {
                initialValue: 'ZJU-Annotator-000',
                rules: [
                  { required: true, message: 'Please input your Authorization Code!' }
                ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('phoneNumber', {
                initialValue: 'Optional Phone Number',
                rules: [
                  { required: false }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                />
              )}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="javascript:void(0);">Ask for an authorization code</a>
          </Form>
        </div>
      </div>
    )
  }
}

const LoginForm = Form.create()(BasicLogin)
export default LoginForm
