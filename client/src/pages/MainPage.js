import React from 'react';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { useUserState } from '../context/UserContext';

const { Content } = Layout;

function MainPage() {
    const state = useUserState();
    const { user } = state;
    return (
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            Content, {user ? user.nickname : '아직 로그인되지 않음'}
        </Content>
    )
}

export default withRouter(MainPage);
