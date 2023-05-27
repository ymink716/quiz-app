import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

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
import BookmarkPage from './pages/BookmarkPage';
import StudyWordsPage from './pages/StudyWordsPage';
import QuizPage from './pages/QuizPage';
import QuizResultPage from './pages/QuizResultPage';
import MyInfoPage from './pages/MyInfoPage';

import { useUserState } from './context/UserContext';

import { Layout } from 'antd';
const { Content } = Layout;

function App() {
  const state = useUserState();
  const { user } = state;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MainHeader />
      <Content style={{ padding: '0 50px', }}>
        <Layout >
          <MainSide />
          {user ? (
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/myFolder" element={<MyFolderPage />} />
              <Route path="/folder/:folderId" element={<FolderDetailPage />} />
              <Route path="/createUnit/:folderId" element={<SaveUnitPage />} />
              <Route path="/updateUnit/:unitId" element={<SaveUnitPage />} />
              <Route path="/unit/:unitId" element={<ReadUnitPage />} />
              <Route path="/createImage/:folderId" element={<SaveImagePage />} />
              <Route path="/image/:unitId" element={<ReadImagePage />} />
              <Route path="/bookmark" element={<BookmarkPage />} />
              <Route path="/study/:unitId" element={<StudyWordsPage />} />
              <Route path="/quiz/:unitId" element={<QuizPage />} />
              <Route path="/quizResult/:unitId" element={<QuizResultPage />} />
              <Route path="/myInfo" element={<MyInfoPage />} />
            </Routes>
            ) : (
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unit/:unitId" element={<ReadUnitPage />} />
              <Route path="/image/:unitId" element={<ReadImagePage />} />
              <Route path="/study/:unitId" element={<StudyWordsPage />} />
              <Route path="/quiz/:unitId" element={<QuizPage />} />
              <Route path="/quizResult/:unitId" element={<QuizResultPage />} />
            </Routes>
          )}
        </Layout>
      </Content>
      <MainFooter/>
    </Layout>
  );
}

export default App;