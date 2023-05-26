import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { Button } from 'antd';
import { BookTwoTone, BookOutlined } from '@ant-design/icons'
import axios from 'axios';

function BookmarkButton(props) {
    const userState = useUserState();
    const { token, user } = userState;

    const [counts, setCounts] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        axios.get(`/api/bookmark/counts/${props.unitId}`)
        .then(response => {
            if (response.data.success) {
                setCounts(response.data.bookmarks.length);
                
                response.data.bookmarks.map(bookmark => {
                    if (user && bookmark.userId == user._id) setBookmarked(true);
                });
            } else {
                alert('북마크 정보를 가져오는데 실패했습니다.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('에러가 발생하였습니다.');
        });
    }, []);

    const addBookmark = (e) => {
        axios.post(
            '/api/bookmark', 
            { unitId: props.unitId },
            { headers: { Authorization: token }}
        ).then(response => {
            if (response.data.success) {
                setCounts(counts + 1);
                setBookmarked(true);
            } else {
                alert('북마크에 실패했습니다.');
            }
        }).catch(error => {
            alert('에러가 발생했습니다.');
        });
    }

    const deleteBookmark = (e) => {     
        axios.delete(
            '/api/bookmark', { 
                headers: { Authorization: token },
                data: { userId: user._id, unitId: props.unitId },
            },
        ).then(response => {
            if (response.data.success) {
                setCounts(counts - 1);
                setBookmarked(false);
            } else {
                alert('북마크 해제에 실패했습니다.');
            }
        }).catch(error => {
            alert('에러가 발생했습니다.');
        });
    }

    return (
        <>
            {user ? bookmarked ? (
                <Button icon={<BookTwoTone />} onClick={deleteBookmark}>{`북마크 ${counts}`}</Button>
            ) : (
                <Button icon={<BookOutlined />} onClick={addBookmark}>{`북마크 ${counts}`}</Button>
            ) : (
                <Button icon={<BookOutlined />} disabled>{`북마크 ${counts}`}</Button>
            )}
        </>
    )
}

export default withRouter(BookmarkButton);