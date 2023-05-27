import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';

function QuizResultPage(props) {
    const navigate = useNavigate();
    const { unitId } = useParams();
    const { state } = useLocation();
    
    let words = state.words;
    const answers = state.answers;
    const [answerCount, setAnswerCount] = useState(0);

    useEffect(() => {
        words.map((word, index) => {
            word.answer = answers[index];
            word.index = index + 1;
            if (word.meaning == word.answer) {
                word.check = true;
                setAnswerCount(answerCount => answerCount + 1);
            }
            else word.check = false;
        });
    }, []);

    const columns = [
        {
          title: 'No',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: 'Word',
          dataIndex: 'word',
          key: 'word',
        },
        {
          title: 'Meaning',
          dataIndex: 'meaning',
          key: 'meaning',
        },
        {
            title: 'My Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Check',
            dataIndex: 'check',
            key: 'check',
            render: check => check ? 
                <CheckCircleOutlined style={{ color: "rgba(38, 194, 129, 1)", fontSize: '150%' }} /> 
                : <CloseCircleOutlined style={{ color: "rgba(255, 99, 71, 1)", fontSize: '150%' }}/>
        },
    ];

    const goBack = () => navigate(`/unit/${unitId}`);

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="테스트 결과"
                subTitle={` ${answerCount} / ${words.length} `}
                extra={[ <Button onClick={goBack}>뒤로 가기</Button> ]}
            >
                <hr />
            </PageHeader>
            
            <Table columns={columns} dataSource={words} />
        </div>
    )
}

export default QuizResultPage;