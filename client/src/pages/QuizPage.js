import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { PageHeader, Button, Input } from 'antd';
import axios from 'axios';

function QuizPage(props) {
    const { unitId } = props.match.params;
    const [words, setWords] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
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
                <Link to={{
                    pathname: `/quizResult/${unitId}`,
                    state: { words, answers }
                }}>
                    <Button type="primary">정답 확인</Button>
                </Link>
            </div>
        </div>
    )
}

export default withRouter(QuizPage);