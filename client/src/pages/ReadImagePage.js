import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { PageHeader, Button } from 'antd';
import axios from 'axios';

function ReadImagePage(props) {
    const userState = useUserState();
    const { token, user } = userState;
    const { unitId } = props.match.params;

    const [titleState, setTitleState] = useState('');
    const [descriptionState, setDescriptionState] = useState('');
    const [imageState, setImageState] = useState('');
    const [isOwnerState, setIsOwnerState] = useState(false);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitleState(response.data.unit.title);
                setDescriptionState(response.data.unit.description);
                setImageState(response.data.unit.imageURL);
                if (user && toString(user._id) === toString(response.data.unit.maker._id)) setIsOwnerState(true);
            } else {
                alert('이미지 불러오기를 실패했습니다.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }, []);

    const deleteImageHandler = (e) => {
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

    const bookmarkHandler = (e) => {
        // 로그인한 사용자인지 아닌지 구분
    }

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title={titleState}
                subTitle={descriptionState}
                extra={
                    isOwnerState ? ([
                        <Button onClick={deleteImageHandler}>삭 제</Button>
                    ]) : ([
                        <Button onClick={bookmarkHandler}>북마크</Button>
                    ])
                }
            >
                <hr style={{ width: '100%' }}/>
            </PageHeader>
            
            <img 
                style={{ marginLeft: '5%' }}
                src={`http://localhost:5000/${imageState}`} 
                alt={titleState} 
                width= '600px'
                height= '600px'    
            />
        </div>
    )
}

export default withRouter(ReadImagePage);