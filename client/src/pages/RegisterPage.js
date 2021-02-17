import React from 'react'
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { MailOutlined, UserOutlined } from '@ant-design/icons';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
 
function RegisterPage(props) {
    const onFinish = async (values) => {
        const { email, nickname, password, passwordConfirm } = values;
        if (password !== passwordConfirm) {
            alert('비밀번호와 비밀번호 확인은 일치해야 합니다.');
        } else {
            const response = await axios.post('/api/auth/register', { email, nickname, password });
    
            if (response.status(201)) {
                alert('회원가입에 성공하였습니다.');
                props.history.push('/login');
            } else {
                alert('회원가입에 실패하였습니다.');
            }
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        alert('입력하신 정보를 다시 확인해주세요.');
    };

    return (
        <div style={{ margin: 'auto' }}>
            <Form
                {...layout}
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
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="passwordConfirm"
                    rules={[{ required: true, message: 'Please input your password again!' }]}
                >
                    <Input.Password />
                </Form.Item>
            
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        회원가입
                    </Button>
                </Form.Item>
            </Form>
        </div>
      );
}

export default RegisterPage;