import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { PageHeader, Button } from 'antd';

function QuizPage(props) {
    let words = props.location.state.words;
    const unitId = props.location.state.unitId;
    const [answers, setAnswers] = useState(new Array(words.length));

    useEffect(() => {
        for (let i = words.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
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
                            value={words[index].word}
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