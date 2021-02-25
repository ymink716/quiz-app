import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import MainSide from './components/MainSide';

import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MyFolderPage from './pages/MyFolderPage';
import NotFoundPage from './pages/NotFoundPage';

import { useUserState } from './context/UserContext';

import { Layout } from 'antd';
const { Content } = Layout;

function App() {
  const state = useUserState();
  const { user } = state;

  return (
    <Layout>
      <MainHeader />
      <Content style={{ padding: '0 50px' }}>
        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
          <MainSide />
          {user ? (
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route exact path="/myFolder" component={MyFolderPage} />
              <Route exact path="/*" component={NotFoundPage} />
            </Switch>
            ) : (
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route exact path="/register" component={RegisterPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/*" component={NotFoundPage} />
            </Switch>
          )}
        </Layout>
      </Content>
      <MainFooter/>
    </Layout>
  );
}

export default App;
