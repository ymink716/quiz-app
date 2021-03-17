import React from 'react';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { useUserState, useUserDispatch, logout } from '../context/UserContext';
import { Layout, Menu, Input } from 'antd';
const { Header } = Layout;
const { Search } = Input;

function MainHeader(props) {
    const state = useUserState();
    const dispatch = useUserDispatch();
    const { user } = state;

    const logoutHandler = async () => {
        await logout(dispatch);
        props.history.push('/');
    }

    const onSearch = (value) => {
        window.location.href=`/?search=${value}`;
    }

    return (
        <Header className="header" style={{ marginBottom: '20px' }}>       
            <div className="logo" style={{ float: 'left', marginRight: '15%', fontSize: '2em' }}>
                <a href="/">Quiz</a>
            </div>     
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
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
                    <a onClick={logoutHandler}>로그아웃</a>
                </Menu.Item>
            </Menu>
            ) : (
                <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
                    <Menu.Item key="login">
                        <a href="/login">로그인</a>
                    </Menu.Item>
                    <Menu.Item key="register">
                        <a href="/register">회원가입</a>
                    </Menu.Item>
                </Menu>
            )}
        </Header>
    );
}

export default withRouter(MainHeader);