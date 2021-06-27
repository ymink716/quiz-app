import React from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState, useUserDispatch, updateUser, logout } from '../context/UserContext';
import { PageHeader, Button, Form, Input, Divider } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

function MyInfoPage(props) {
    const userState = useUserState();
    const dispatch = useUserDispatch();
    const { token, user } = userState;
    
    const myFolderHandler = () => props.history.push('/myFolder');
    const bookmarkHandler = () => props.history.push('/bookmark');

    const updateProfile = async (values) => {
        const check = window.confirm('변경하시겠습니까?');
        if (!check) return

        try {
            const response = await updateUser(dispatch, values);
            if (response.data.success) {
                alert('변경되었습니다.');
            } else {
                alert('에러가 발생하였습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const changePassword = async (values) => {
        if (values.newPassword !== values.newPassword2) {
            alert('비밀번호를 확인해주세요.');
            return
        }

        const check = window.confirm('변경하시겠습니까?');
        if (!check) return

        try {
            const response = await updateUser(dispatch, { 
                currentPassword: values.currentPassword, newPassword: values.newPassword 
            });

            if (response.data.success) {
                alert('변경되었습니다.');
            } 
        } catch (error) {
            console.error(error);
            alert('비밀번호를 확인해주세요.');
        }
    }

    const unregister = async (values) => {        
        const check = window.confirm('회원탈퇴 시 모든 활동 내역 및 계정이 삭제됩니다. 진행하시겠습니까?');
        if (!check) return

        try {
            const response = await axios.delete(
                '/api/user', { 
                    headers: {Authorization: token },
                    data: { password: values.password }
            });
            if (response.data.success) {
                alert('정상적으로 처리되었습니다.');
                await logout(dispatch);
                props.history.push('/');
            } else {
                alert('비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error(error);
            alert('에러가 발생했습니다.');
        }
    }

    const onFinishFailed = (errorInfo) => {
        alert('입력하신 정보를 다시 확인해주세요.');
    };
    
    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title='내정보'
                subTitle={`${user.nickname}`}              
                extra={[
                    <Button onClick={myFolderHandler}>내폴더</Button>,
                    <Button onClick={bookmarkHandler}>북마크</Button>,
                    <Button>로그아웃</Button>
                ]}
            >
                <hr />
            </PageHeader>
            
            <Divider orientation="left">프로필</Divider>
            <Form
                layout="inline"
                initialValues={user}
                onFinish={updateProfile}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item  
                    name="email"
                    label="E-mail"
                    rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                >
                    <Input 
                        prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    />
                </Form.Item>
                <Form.Item 
                    name="nickname"
                    label="Nickname"
                    rules={[{ required: true, message: 'Please input your nick name!' }]}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">프로필 업데이트</Button>
                </Form.Item>
            </Form>

            <Divider orientation="left">비밀번호 변경</Divider>
            <Form
                layout="inline"
                onFinish={changePassword}
            >
                <Form.Item 
                    name="currentPassword"
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="현재 비밀번호"
                    />
                </Form.Item>
                <Form.Item 
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="새 비밀번호"
                    />
                </Form.Item>
                <Form.Item 
                    name="newPassword2"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="새 비밀번호 확인"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">비밀번호 변경</Button>
                </Form.Item>
            </Form>
            
            <Divider orientation="left">회원 탈퇴</Divider>
            <Form
                layout="inline"
                onFinish={unregister}
            >
                <Form.Item 
                    label="비밀번호 확인" 
                    name="password"
                    rules={[{ required: true, message: 'Please input your new password!' }]}    
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        placeholder="비밀번호 확인"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">회원 탈퇴</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default withRouter(MyInfoPage);