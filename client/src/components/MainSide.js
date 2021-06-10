import React from 'react';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { useUserState } from '../context/UserContext';

const { Sider } = Layout;

function MainSide() {
  const state = useUserState();
  const { user } = state;

  return (
      <Sider className="site-layout-background" width={200}>
        {user ? (
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="home"><a href="/">Home</a></Menu.Item>
          <Menu.Item key="myFolder"><a href="/myFolder">내폴더</a></Menu.Item>
          <Menu.Item key="bookmark"><a href="/bookmark">북마크</a></Menu.Item>
          <Menu.Item key="myInfo">내정보</Menu.Item>
        </Menu>
        ) : (
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="home"><a href="/">Home</a></Menu.Item>
          <Menu.Item key="login"><a href="/login">로그인</a></Menu.Item>
          <Menu.Item key="register"><a href="/register">회원가입</a></Menu.Item>
        </Menu>
        )}
      </Sider>
  );
}

export default withRouter(MainSide);