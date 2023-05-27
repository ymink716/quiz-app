import React from 'react';
import { useUserState, useUserDispatch, logout } from '../context/UserContext';
import { Layout, Menu, Input, Button } from 'antd';
const { Header } = Layout;
const { Search } = Input;

function MainHeader(props) {
    const state = useUserState();
    const dispatch = useUserDispatch();
    const { user } = state;

    const handleLogout = async (e) => {
        await logout(dispatch);
        window.location.href='/';
    }

    const handleLogin = (e) => {
        window.location.href='/login';
    }

    const onSearch = (value) => {
        window.location.href=`/?search=${value}`;
    }

    return (
        <Header className="header" style={{ marginBottom: '20px' }}>       
            <div className="logo" style={{ float: 'left', marginLeft: '3%', marginRight: '20%', fontSize: '2em' }}>
                <a href="/">Quiz</a>
            </div>     
            <Search
                allowClear
                enterButton
                size="large"
                onSearch={onSearch}
                style={{ 
                    width: '50%',
                    verticalAlign: 'middle'
                }}
            />
            {user ? (
                <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
                    <Menu.Item key="logout">
                        <Button ghost onClick={handleLogout}>로그아웃</Button>
                    </Menu.Item>
                </Menu>
            ) : (
                <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
                    <Menu.Item key="login">
                        <Button ghost onClick={handleLogin}>로그인</Button>
                    </Menu.Item>
                </Menu>
            )}
        </Header>
    );
}

export default MainHeader;