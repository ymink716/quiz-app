import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { PageHeader, Button, List } from 'antd';
import axios from 'axios';
import Bookmarks from '../components/Bookmarks';

function ReadUnitPage(props) {
    const userState = useUserState();
    const { token, user } = userState;
    const { unitId } = props.match.params;

    const [titleState, setTitleState] = useState('');
    const [descriptionState, setDescriptionState] = useState('');
    const [wordsState, setWordsState] = useState([]);
    const [isOwnerState, setIsOwnerState] = useState(false);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitleState(response.data.unit.title);
                setDescriptionState(response.data.unit.description);
                setWordsState([ ...response.data.unit.words ]);
                if (user && user.email == response.data.unit.maker.email) setIsOwnerState(true);
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('에러가 발생하였습니다.');
        });
    }, []);

    const studyWordsHandler = (e) => props.history.push(`/study/${unitId}`);
    const quizHandler = (e) => props.history.push(`/quiz/${unitId}`);
    const updateWordsHandler = (e) => props.history.push(`/updateUnit/${unitId}`);

    const deleteWordsHandler = (e) => {
        const check = window.confirm('정말로 삭제하시겠습니까?');
        if (!check) return

        axios.delete(
            `/api/unit/${unitId}`,
            { headers: { Authorization: token }}
        ).then(response => {
            if (response.data.success) {
                props.history.push(`/folder/${response.data.deletedUnit.folder}`);
            } else {
                alert(response.data.message);
            }
        }).catch(error => {
            console.error(error);
            alert('단어장 삭제에 실패했습니다.');
        });
    }

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            {user && isOwnerState ? (
                <PageHeader
                    title={titleState}
                    subTitle={descriptionState}              
                    extra={[
                        <Button onClick={studyWordsHandler}>학 습</Button>,
                        <Button onClick={quizHandler}>퀴 즈</Button>,
                        <Bookmarks unitId={unitId} />,
                        <Button onClick={updateWordsHandler}>수 정</Button>,
                        <Button onClick={deleteWordsHandler}>삭 제</Button>,
                        ]}
                >
                    <hr style={{ width: '100%' }}/>
                </PageHeader>
            ) : (
                <PageHeader
                    title={titleState}
                    subTitle={descriptionState}              
                    extra={[
                        <Button onClick={studyWordsHandler}>학 습</Button>,
                        <Button onClick={quizHandler}>퀴 즈</Button>,
                        <Bookmarks unitId={unitId} />,
                    ]}
                >
                    <hr style={{ width: '100%' }}/>
                </PageHeader>
            )}

            <List
                header={`총 ${wordsState.length}단어`}
                dataSource={wordsState}
                renderItem={item => (
                    <List.Item>
                        <div style={{ width: '30%' }}>{item.word}</div>
                        <div style={{ width: '30%' }}>{item.meaning}</div>

                        { /* 음성 사전 기능 추가 */}
                    </List.Item>
                )}
            >
            </List>
        </div>
    )
}

export default withRouter(ReadUnitPage);