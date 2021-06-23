import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { PageHeader, Button } from 'antd';
import axios from 'axios';
import WordsCarousel from '../components/WordsCarousel';

function StudyWordsPage(props) {
    const { unitId } = props.match.params;

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

    const quizHandler = (e) => props.history.push(`/quiz/${unitId}`);
    const quitStudy = (e) => props.history.push(`/unit/${unitId}`);

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

export default withRouter(StudyWordsPage);