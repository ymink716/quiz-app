import React from 'react'
import { Form, Input, Button, Icon } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
  
const onFinish = (values) => {
    const { email, nickName, password, passwordConfirm } = values;
    
    if (password != passwordConfirm) {
        alert('비밀번호와 비밀번호 확인은 일치해야 합니다.');
    } else {
        // 회원가입 요청 보내기
        
        // 성공 시 알림 후 로그인 페이지로 넘기기

        // 실패시 실패 메세지
        }
    
     
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    alert('회원가입에 실패하였습니다. 입력하신 정보를 다시 확인해주세요.');
};

const 
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
                    name="passwordconfirm"
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