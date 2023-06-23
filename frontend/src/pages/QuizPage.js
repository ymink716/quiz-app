import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Input } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';

function QuizPage() {
    const { unitId } = useParams();
    const [words, setWords] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        axios.get(`/api/units/${unitId}`)
        .then(response => {
            if (response.data.success) {
                if (response.data.unit.words && response.data.unit.words.length !== 0) 
                    setWords([ ...response.data.unit.words ]);
                setAnswers(new Array(words.length));
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        }).catch((error) => alert('에러가 발생하였습니다.'));
    }, []);

    const handleAnswerChange = (e) => {
        const updatedAnswers = [ ...answers ];
        updatedAnswers[e.target.getAttribute('index')] = e.target.value;
        setAnswers(updatedAnswers);
    }

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="테스트"
                extra={[ <Button href={`/unit/${unitId}`}>뒤로 가기</Button> ]}
            >
                <hr />
            </PageHeader>

            <div style={{ margin: '0 auto', textAlign: 'center' }}>
                {words.map((word, index) => {
                    return (
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ marginRight: '10px', display: 'inline' }}>
                                {`#${index + 1}`}
                            </h3>
                            <Input
                                value={word.word}
                                disabled
                                size="large"
                                style={{ width: '30%', textAlign: 'center', cursor: 'default' }}
                            />
                            <Input
                                name="answer"
                                index={index}
                                onChange={handleAnswerChange}
                                size="large"
                                style={{ width: '30%', textAlign: 'center' }}
                            />
                        </div>
                    )
                })}
                <Link to={`/quizResult/${unitId}`} state={{ words, answers }}>
                    <Button type="primary">정답 확인</Button>
                </Link>
            </div>
        </div>
    )
}

export default QuizPage;