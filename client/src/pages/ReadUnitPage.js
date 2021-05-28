import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import axios from 'axios';

function ReadUnitPage(props) {
    const userState = useUserState();
    const { token } = userState;
    const { unitId } = props.match.params;

    const [titleState, setTitleState] = useState('');
    const [descriptionState, setDescriptionState] = useState('');
    const [wordsState, setWordsState] = useState([]);
    const [isOwnerState, setIsOwnerState] = useState(false);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`, { headers: {Authorization: token }})
        .then(response => {
            if (response.data.success) {
                
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }, []);

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <div style={{ marginBottom: '20px' }}> 
                <div style={{ fontSize: '1.5rem', float: 'left' }}>단어장 읽기 페이지</div>
                <hr style={{ clear: 'both', width: '100%' }}/>
            </div>

        { /* 학습 수정 삭제 버튼 */}
        { /* 음성 사전 기능 추가 */}
        </div>
    )
}

export default withRouter(ReadUnitPage);