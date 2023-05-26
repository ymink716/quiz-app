import React from 'react';
import "antd/dist/antd.css";
import { Layout } from 'antd';

const { Footer } = Layout;

function MainFooter() {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Quiz App ©2021 Created by ymink716
        </Footer>
    );
}

export default MainFooter;