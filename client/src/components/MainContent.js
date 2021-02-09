import React from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';

const { Content } = Layout;

function MainContent() {
    return (
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            Content
        </Content>
    )
}

export default MainContent;
