import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { PageHeader, Button, Input, Avatar, Divider } from 'antd';
import { SoundOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import BookmarkButton from '../components/BookmarkButton';
import ReviewButton from '../components/ReviewButton';
import { useSpeechSynthesis } from 'react-speech-kit';

function ReadUnitPage(props) {
    const userState = useUserState();
    const { token, user } = userState;
    const { unitId } = props.match.params;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [words, setWords] = useState([]);
    const [maker, setMaker] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitle(response.data.unit.title);
                setDescription(response.data.unit.description);
                if (response.data.unit.words && response.data.unit.words.length !== 0) 
                    setWords([ ...response.data.unit.words ]);
                setMaker(response.data.unit.maker);
                if (user && user.email == response.data.unit.maker.email) setIsOwner(true);
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        }).catch((error) => alert('에러가 발생하였습니다.'));
    }, []);

    const handleDeleteWords = (e) => {
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
        }).catch(error => alert('단어장 삭제에 실패했습니다.'));
    }

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            {user && isOwner ? (
                <PageHeader
                    title={title}
                    subTitle={<ReviewButton unitId={unitId} />}              
                    extra={[
                        <Button href={`/study/${unitId}`}>학 습</Button>,
                        <Button href={`/quiz/${unitId}`}>퀴 즈</Button>,
                        <BookmarkButton unitId={unitId} />,
                        <Button href={`/updateUnit/${unitId}`}>수 정</Button>,
                        <Button onClick={handleDeleteWords}>삭 제</Button>,
                        ]}
                >
                    <Avatar 
                        size="small"
                        icon={<UserOutlined />}
                        style={{marginRight: '5px'}}
                    />{maker.nickname}
                    <Divider type="vertical" />
                    <span>{`${description} (${words.length}단어)`}</span>
                    <hr />
                </PageHeader>
            ) : (
                <PageHeader
                    title={title}
                    subTitle={<ReviewButton unitId={unitId} />}              
                    extra={[
                        <Button href={`/study/${unitId}`}>학 습</Button>,
                        <Button href={`/quiz/${unitId}`}>퀴 즈</Button>,
                        <BookmarkButton unitId={unitId} />,
                    ]}
                >
                    <Avatar 
                        size="small"
                        icon={<UserOutlined />}
                        style={{marginRight: '5px'}}
                    />{maker.nickname}
                    <Divider type="vertical" />
                    <span>{`${description} (${words.length}단어)`}</span>
                    <hr />
                </PageHeader>
            )}

            <div style={{ margin: '0 auto', textAlign: 'center' }}>
            {words.map((word, index) => {
                return (
                    <div index={index} style={{ marginBottom: '20px' }}>
                        <h3 style={{ marginRight: '10px', display: 'inline' }}>{`#${index + 1}`}</h3>
                        <Input
                            value={word.word} disabled size="large"
                            style={{ width: '30%', textAlign: 'center', cursor: 'default' }}
                        />
                        <Input
                            value={word.meaning} disabled size="large"
                            style={{ width: '30%', textAlign: 'center', cursor: 'default' }}
                        />
                        <Button 
                            icon={< SoundOutlined/>}
                            onClick={() => speak({ text: word.word })}
                        >
                        </Button>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default withRouter(ReadUnitPage);