import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserState } from '../context/UserContext';

const { Sider } = Layout;

function MainSide() {
  const state = useUserState();
  const { user } = state;

  return (
    <Sider 
      width={200} 
      style={{ backgroundColor: 'white', textAlign: 'center', marginTop: '30px' }}
    >
      {user ? (
        <>
        <div>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginTop: '10px', marginBottom: '10px' }}/>
          <p>{user.email}</p>
        </div>
        <Menu
          mode="inline"
          style={{ margin: '0', textAlign: 'center' }}
        >
          <Menu.Item key="home"><a href="/">Home</a></Menu.Item>
          <Menu.Item key="myFolder"><a href="/myFolder">내폴더</a></Menu.Item>
          <Menu.Item key="bookmark"><a href="/bookmark">북마크</a></Menu.Item>
          <Menu.Item key="myInfo"><a href="/myInfo">내정보</a></Menu.Item>
        </Menu>
        </>
      ) : (
        <Menu
          mode="inline"
          style={{ margin: '0', textAlign: 'center' }}
        >
          <Menu.Item key="home"><a href="/">Home</a></Menu.Item>
          <Menu.Item key="login"><a href="/login">로그인</a></Menu.Item>
          <Menu.Item key="register"><a href="/register">회원가입</a></Menu.Item>
        </Menu>
      )}
    </Sider>
  );
}

export default MainSide;