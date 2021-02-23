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
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="voca">단어장</Menu.Item>
          <Menu.Item key="image">이미지</Menu.Item>
          <Menu.Item key="myFolder">내폴더</Menu.Item>
          <Menu.Item key="create">만들기</Menu.Item>
          <Menu.Item key="bookmark">북마크</Menu.Item>
          <Menu.Item key="myInfo">내정보</Menu.Item>
        </Menu>
        ) : (
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="voca">단어장</Menu.Item>
          <Menu.Item key="image">이미지</Menu.Item>
        </Menu>
        )}
      </Sider>
  );
}

export default withRouter(MainSide);