import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { PageHeader, Button } from 'antd';
import axios from 'axios';

function QuizPage(props) {
    const { unitId } = props.match.params;
    const [words, setWords] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setWords([ ...response.data.unit.words]);
                setAnswers(new Array(words.length));
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        }).catch((error) => alert('에러가 발생하였습니다.'));
    }, []);

    const goBack = () => props.history.push(`/unit/${unitId}`);

    const handleAnswerChange = (e) => {
        const updatedAnswers = [ ...answers ];
        updatedAnswers[e.target.getAttribute('index')] = e.target.value;
        setAnswers(updatedAnswers);
    }

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="테스트"
                extra={[ <Button onClick={goBack}>뒤로 가기</Button> ]}
            >
                <hr />
            </PageHeader>

            {words.map((word, index) => {
                return (
                    <div>
                        <label>{`#${index + 1}`}</label>
                        <input
                            type="text"
                            value={word.word}
                            disabled
                        />
                        <input
                            type="text"
                            name="answer"
                            index={index}
                            onChange={handleAnswerChange}
                        />
                    </div>
                )
            })}

            <Link to={{
                pathname: `/quizResult/${unitId}`,
                state: { words, answers }
            }}>
                <Button>정답 확인</Button>
            </Link>
        </div>
    )
}

export default withRouter(QuizPage);