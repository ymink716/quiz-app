import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

function MainSide() {
    return (
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">단어장</Menu.Item>
            <Menu.Item key="3">이미지</Menu.Item>
            <Menu.Item key="4">내폴더</Menu.Item>
            <Menu.Item key="5">만들기</Menu.Item>
            <Menu.Item key="6">북마크</Menu.Item>
            <Menu.Item key="7">내정보</Menu.Item>
          </Menu>
        </Sider>
    );
}

export default MainSide;