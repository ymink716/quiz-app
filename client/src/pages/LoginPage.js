import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useUserState, useUserDispatch, login } from '../context/UserContext';

function LoginPage(props) {
    const state = useUserState();
    const dispatch = useUserDispatch();
    const { errorMessage } = state;

    const onFinish = async (values) => {
        try {
            const response = await login(dispatch, values);
            if (!response.data.success) {
                alert('아이디와 비밀번호를 다시 확인해주세요.');
            } else {
                props.history.push('/');
            }
        } catch (error) {
            console.error(error);
            alert('아이디와 비밀번호를 다시 확인해주세요.');
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        alert('입력하신 정보를 다시 확인해주세요.');
    };

    return (
        <div style={{ margin: 'auto' }}>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
            <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
            >
                <Input 
                    prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Email"
                />
            </Form.Item>
        
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password 
                    prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Password"
                />
            </Form.Item>
        
            <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
        
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    로그인
                </Button>
            </Form.Item>
            </Form>
        </div>
      );
}

export default withRouter(LoginPage);
