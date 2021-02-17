import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import MainSide from './components/MainSide';
import MainContent from './components/MainContent';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';


import { Layout } from 'antd';
const { Content } = Layout;

function App() {
  return (
    <Layout>
      <MainHeader />
      <Content style={{ padding: '0 50px' }}>
        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
          <MainSide />
          <Switch>
            <Route exact path="/" component={MainContent} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/*" component={NotFoundPage} />
          </Switch>
        </Layout>
      </Content>
      <MainFooter/>
    </Layout>  
  );
}

export default App;
