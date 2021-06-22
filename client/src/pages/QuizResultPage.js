import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import { PageHeader, Button, Table } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
function QuizResultPage(props) {
    let words = props.location.state.words;
    const { unitId } = props.match.params;
    const answers = props.location.state.answers;
    const [answerCount, setAnswerCount] = useState(0);

    useEffect(() => {
        console.log(words, answers);
        words.map((word, index) => {
            word.answer = answers[index];
            word.index = index + 1;
            if (word.meaning == word.answer) {
                word.check = true;
                setAnswerCount(answerCount + 1);
            }
            else word.check = false;
        });
        console.log(words);
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
            render: check => check ? <CheckCircleOutlined /> : <CloseCircleOutlined />
        },
    ];

    const goBack = () => props.history.push(`/unit/${unitId}`);

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="테스트 결과"
                subTitle={`${words.length}개 중 개 ${answerCount}맞춤`}
                extra={[ <Button onClick={goBack}>뒤로 가기</Button> ]}
            >
                <hr />
            </PageHeader>
            
            <Table columns={columns} dataSource={words} />
        </div>
    )
}

export default withRouter(QuizResultPage);