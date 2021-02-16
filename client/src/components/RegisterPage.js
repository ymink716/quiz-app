import React from 'react'
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
  
const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

function RegisterPage() {
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
                label="E-mail"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="닉네임"
                name="nickName"
                rules={[{ required: true, message: 'Please input your nick name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="비밀번호"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="비밀번호"
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
