import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { Button, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';
import BookmarkButton from '../components/BookmarkButton';
import ReviewButton from '../components/ReviewButton';

function ReadImagePage(props) {
    const navigate = useNavigate();
    const userState = useUserState();
    const { token, user } = userState;
    const { unitId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [maker, setMaker] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitle(response.data.unit.title);
                setDescription(response.data.unit.description);
                setImage(response.data.unit.imageURL);
                setMaker(response.data.unit.maker);
                if (user && user.email == response.data.unit.maker.email) setIsOwner(true);
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
            `/api/image/${unitId}`,
            { headers: { Authorization: token }}
        ).then(response => {
            if (response.data.success) navigate(`/folder/${response.data.deletedImage.folder}`);
            else alert(response.data.message);
        }).catch(error => {
            console.error(error);
            alert('단어장 삭제에 실패했습니다.');
        });
    }

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            {user && isOwner ? (
                <PageHeader
                    title={title}
                    subTitle={<ReviewButton unitId={unitId} />}
                    extra={[
                        <BookmarkButton unitId={unitId} />,
                        <Button onClick={deleteImageHandler}>삭 제</Button>
                    ]}
                >
                    <Avatar 
                        size="small"
                        icon={<UserOutlined />}
                        style={{marginRight: '5px'}}
                    />{maker.nickname}
                    <Divider type="vertical" />
                    <span>{description}</span>
                    <hr />
                </PageHeader>
            ) : (
                <PageHeader
                    title={title}
                    subTitle={<ReviewButton unitId={unitId} />}
                    extra={[
                        <BookmarkButton unitId={unitId} />,
                    ]}
                >
                    <Avatar 
                        size="small"
                        icon={<UserOutlined />}
                        style={{marginRight: '5px'}}
                    />{maker.nickname}
                    <Divider type="vertical" />
                    <span>{description}</span>
                    <hr />
                </PageHeader>
            )}
            
            <div style={{ textAlign: 'center' }}>
                <img 
                    style={{ 
                        maxWidth: '1000px',
                        height: 'auto',
                        marginBottom: '20px'
                    }}
                    src={image} 
                    alt={title} 
                />
            </div>
        </div>
    )
}

export default ReadImagePage;