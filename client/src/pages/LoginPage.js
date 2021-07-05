import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, PageHeader } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useUserDispatch, login } from '../context/UserContext';

function LoginPage() {
    const dispatch = useUserDispatch();

    const onFinish = async (values) => {
        try {
            const response = await login(dispatch, values);
            if (!response.data.success) {
                alert('아이디와 비밀번호를 다시 확인해주세요.');
            } else {
                window.location.href='/';
            }
        } catch (error) {
            console.error(error);
            alert('아이디와 비밀번호를 다시 확인해주세요.');
        }
    };
    
    const onFinishFailed = (errorInfo) => alert('입력하신 정보를 다시 확인해주세요.');

    return (
        <div style={{ margin: 'auto' }}>
            <PageHeader title='Log-in'>
                <hr />
            </PageHeader>

            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size="large"
            >
            <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: '이메일을 입력하세요.' }]}
            >
                <Input 
                    prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="E-mail"
                />
            </Form.Item>
        
            <Form.Item
                name="password"
                rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}
            >
                <Input.Password 
                    prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Password"
                />
            </Form.Item>
        
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    로그인
                </Button>
            </Form.Item>

            <Form.Item name="register" style={{ textAlign: "center" }}>
                <a href="/register" >회 원 가 입</a>
            </Form.Item>
            </Form>
        </div>
      );
}

export default withRouter(LoginPage);
