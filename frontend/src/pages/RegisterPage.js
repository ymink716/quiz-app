import React from 'react'
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, PageHeader } from 'antd';
import axios from 'axios';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

function RegisterPage(props) {
    const onFinish = (values) => {
        const { email, nickname, password, passwordConfirm } = values;
        if (password !== passwordConfirm) {
            alert('비밀번호와 비밀번호 확인은 일치해야 합니다.');
        } else {
            axios.post('/api/user/register', { email, nickname, password })
            .then(response => {
                if (response.data.success) {
                    alert('회원가입에 성공하였습니다.');
                    props.history.push('/login');
                } else {
                    alert(response.data.message);
                }
            }).catch(error => {
                console.error(error.response.data);
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert('오류가 발생하여 회원가입에 실패하였습니다.');
                }
            });
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        alert('입력하신 정보를 다시 확인해주세요.');
    };

    return (
        <div style={{ margin: 'auto' }}>
            <PageHeader title='Register'>
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
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="nickname"
                    rules={[{ required: true, message: '닉네임(2~10글자)', min: 2, max: 10 }]}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="Nickname"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '비밀번호(6글자 이상)', min: 6 }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item
                    name="passwordConfirm"
                    rules={[{ required: true, message: '비밀번호(6글자 이상)', min: 6 }]}
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

export default withRouter(RegisterPage);