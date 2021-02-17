import React from 'react'
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

function RegisterPage(props) {
    const onFinish = (values) => {
        const { email, nickname, password, passwordConfirm } = values;
        if (password !== passwordConfirm) {
            alert('비밀번호와 비밀번호 확인은 일치해야 합니다.');
        } else {
            axios.post('/api/auth/register', { email, nickname, password })
            .then(response => {
                if (response.status === 201) {
                    alert('회원가입에 성공하였습니다.');
                    props.history.push('/login');
                } else {
                    alert(response.data.message);
                }
            }).catch(error => {
                console.error(error);
                alert('오류가 발생하여 회원가입에 실패하였습니다.');
            });
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                    name="nickname"
                    rules={[{ required: true, message: 'Please input your nick name!' }]}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="Nickname"
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
                <Form.Item
                    name="passwordConfirm"
                    rules={[{ required: true, message: 'Please input your password again!' }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="Confirm password"
                    />
                </Form.Item>
            
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        회원가입
                    </Button>
                </Form.Item>
            </Form>
        </div>
      );
}

export default RegisterPage;