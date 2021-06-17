import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

function QuizButton(props) {
    return (
        <Link to={{
            pathname: `/quiz/${props.unitId}`,
            state: { words: props.words, unitId: props.unitId }
        }}>
            <Button>퀴 즈</Button>
        </Link>
    )
}

export default QuizButton;