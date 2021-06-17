import React from 'react'
import { withRouter } from 'react-router-dom';
import { PageHeader, Button } from 'antd';

function QuizResultPage(props) {
    const words = props.location.state.words;
    const { unitId } = props.match.params;
    const answers = props.location.state.answers;

    const goBack = () => props.history.push(`/unit/${unitId}`);

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="테스트 결과"
                extra={[ <Button onClick={goBack}>뒤로 가기</Button> ]}
            >
                <hr />
            </PageHeader>
            

        </div>
    )
}

export default withRouter(QuizResultPage);