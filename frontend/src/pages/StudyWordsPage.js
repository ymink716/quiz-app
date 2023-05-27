import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';
import WordsCarousel from '../components/WordsCarousel';

function StudyWordsPage() {
    const { unitId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [words, setWords] = useState([]);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitle(response.data.unit.title);
                setWords([ ...response.data.unit.words ]);
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        }).catch((error) => alert('에러가 발생하였습니다.'));
    }, []);

    const quizHandler = (e) => navigate(`/quiz/${unitId}`);
    const quitStudy = (e) => navigate(`/unit/${unitId}`);

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title={title}
                subTitle={`${words.length} 단어`}              
                extra={[
                    <Button onClick={quizHandler}>퀴 즈</Button>,
                    <Button onClick={quitStudy}>학습종료</Button>,
                ]}
            >
                <hr style={{ width: '100%' }}/>
            </PageHeader>

            <WordsCarousel words={words} />
        </div>
    )
}

export default StudyWordsPage;