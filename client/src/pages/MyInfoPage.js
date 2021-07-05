import React from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState, useUserDispatch, updateUser, logout } from '../context/UserContext';
import { PageHeader, Button, Form, Input, Divider, Row, Col } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

function MyInfoPage(props) {
    const userState = useUserState();
    const dispatch = useUserDispatch();
    const { token, user } = userState;

    const updateProfile = async (values) => {
        const check = window.confirm('변경하시겠습니까?');
        if (!check) return

        try {
            const response = await updateUser(dispatch, values);

            if (response.data.success) alert('변경되었습니다.');
            else alert('에러가 발생하였습니다.');
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
                currentPassword: values.currentPassword, 
                newPassword: values.newPassword 
            });

            if (response.data.success) alert('변경되었습니다.');
            else alert('비밀번호를 확인해주세요.'); 
        } catch (error) {
            console.error(error);
            alert('에러가 발생했습니다.');
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

    const onFinishFailed = (errorInfo) => alert('입력하신 정보를 다시 확인해주세요.');
    
    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title='내정보'
                subTitle={`${user.nickname}`}              
                extra={[
                    <Button href="/myFolder" >내폴더</Button>,
                    <Button href="/bookmark" >북마크</Button>,
                ]}
            >
                <hr />
            </PageHeader>

            <Row>
                <Col span={8}>
                <Divider orientation="left">프로필</Divider>
                    <Form
                        initialValues={user}
                        size="large"
                        onFinish={updateProfile}
                        onFinishFailed={onFinishFailed}
                        style={{ width: '80%', margin: '0 auto' }}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, type: 'email', message: '이메일을 입력하세요.' }]}
                        >
                            <Input prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />} />
                        </Form.Item>
                        <Form.Item 
                            name="nickname"
                            rules={[{ required: true, message: '닉네임(2~10글자).', min: 2, max: 10 }]}
                        >
                            <Input prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center'}}>
                            <Button type="primary" htmlType="submit">프로필 업데이트</Button>
                        </Form.Item>
                    </Form>
                </Col>

                <Col span={8}>
                <Divider orientation="left">비밀번호 변경</Divider>
                    <Form
                        onFinish={changePassword}
                        size="large"
                        style={{ width: '80%', margin: '0 auto' }}
                    >
                        <Form.Item 
                            name="currentPassword"
                            rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                                placeholder="현재 비밀번호"
                            />
                        </Form.Item>
                        <Form.Item 
                            name="newPassword"
                            rules={[{ required: true, message: '새 비밀번호(6글자 이상)', min: 6 }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                                placeholder="새 비밀번호"
                            />
                        </Form.Item>
                        <Form.Item 
                            name="newPassword2"
                            rules={[{ required: true, message: '새 비밀번호(6글자 이상)', min: 6 }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                                placeholder="새 비밀번호 확인"
                            />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center'}}>
                            <Button type="primary" htmlType="submit">비밀번호 변경</Button>
                        </Form.Item>
                    </Form>
                </Col>

                <Col span={8}>
                <Divider orientation="left">회원 탈퇴</Divider>
                    <Form
                        onFinish={unregister}
                        size="large"
                        style={{ width: '80%', margin: '0 auto' }}
                    >
                        <Form.Item 
                            name="password"
                            rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}    
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                                placeholder="비밀번호 확인"
                            />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center'}} >
                            <Button type="primary" htmlType="submit">회원 탈퇴</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default withRouter(MyInfoPage);