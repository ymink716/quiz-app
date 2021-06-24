import React from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { PageHeader, Button, Form, Input } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

function MyInfoPage(props) {
    const userState = useUserState();
    const { token, user } = userState;
    
    const myFolderHandler = () => props.history.push('/myFolder');
    const bookmarkHandler = () => props.history.push('/bookmark');

    // 상단 버튼 : 내폴더, 북마크
    // 프로필 : 이메일, 닉네임, 프로필업데이트버튼, 비밀번호 변경 버튼, 회원탈퇴 버튼
    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title='내정보'
                subTitle={`${user.nickname}`}              
                extra={[
                    <Button onClick={myFolderHandler}>내폴더</Button>,
                    <Button onClick={bookmarkHandler}>북마크</Button>
                ]}
            >
                <hr />
            </PageHeader>

            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={user}
            >
                <Form.Item label="e-mail" name="email">
                    <Input />
                </Form.Item>
                <Form.Item label="nickname" name="nickname">
                    <Input />
                </Form.Item>
                <Form.Item label="현재 비밀번호" name="currentPassword">
                    <Input />
                </Form.Item>
                <Form.Item label="새 비밀번호" name="newPassword">
                    <Input />
                </Form.Item>
                <Form.Item label="새 비밀번호 확인" name="newPassword2">
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}

export default withRouter(MyInfoPage);