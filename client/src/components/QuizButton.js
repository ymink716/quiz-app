import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

function QuizButton(props) {
    const words = props.words;

    return (
        <Link to={{
            pathname: `/quiz/${props.unitId}`,
            state: { words }
        }}>
            <Button>퀴 즈</Button>
        </Link>
    )
}

export default QuizButton;