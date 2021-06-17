import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import MainSide from './components/MainSide';

import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MyFolderPage from './pages/MyFolderPage';
import FolderDetailPage from './pages/FolderDetailPage';
import SaveUnitPage from './pages/SaveUnitPage';
import ReadUnitPage from './pages/ReadUnitPage';
import SaveImagePage from './pages/SaveImagePage';
import ReadImagePage from './pages/ReadImagePage';
import NotFoundPage from './pages/NotFoundPage';
import BookmarkPage from './pages/BookmarkPage';
import StudyWordsPage from './pages/StudyWordsPage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';

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
              <Route exact path="/folder/:folderId" component={FolderDetailPage} />
              <Route exact path="/createUnit/:folderId" component={SaveUnitPage} />
              <Route exact path="/updateUnit/:unitId" component={SaveUnitPage} />
              <Route exact path="/unit/:unitId" component={ReadUnitPage} />
              <Route exact path="/createImage/:folderId" component={SaveImagePage} />
              <Route exact path="/image/:unitId" component={ReadImagePage} />
              <Route exact path="/bookmark" component={BookmarkPage} />
              <Route exact path="/study/:unitId" component={StudyWordsPage} />
              <Route exact path="/quiz/:unitId" component={QuizPage} />
              <Route exact path="/quizResult/:unitId" component={QuizResultPage} />
              <Route exact path="/*" component={NotFoundPage} />
            </Switch>
            ) : (
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route exact path="/register" component={RegisterPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/unit/:unitId" component={ReadUnitPage} />
              <Route exact path="/image/:unitId" component={ReadImagePage} />
              <Route exact path="/study/:unitId" component={StudyWordsPage} />
              <Route exact path="/quiz/:unitId" component={QuizPage} />
              <Route exact path="/quizResult/:unitId" component={QuizResultPage} />
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