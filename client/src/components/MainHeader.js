import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Input } from 'antd';
const { Header } = Layout;
const { Search } = Input;

function MainHeader() {
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
                onSearch
                style={{ 
                    width: '50%',
                    verticalAlign: 'middle'
                }}
            />
            <Menu theme="dark" mode="horizontal" style={{ float: "right" }}>
                <Menu.Item>
                    <a href="/login">로그인</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="/register">회원가입</a>
                </Menu.Item>
            </Menu>
        </Header>
    );
}

export default MainHeader;