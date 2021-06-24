import React, { useState, useEffect } from 'react';
import { Rate, Button, Modal } from 'antd';
import { useUserState } from '../context/UserContext';
import axios from 'axios';

function ReviewButton(props) {
    const userState = useUserState();
    const { token, user } = userState;
    const [totalRate, setTotalRate] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [userRate, setUserRate] = useState(5);

    useEffect(() => {
        axios.get(`/api/review/${props.unitId}`)
        .then((response) => {
            const reviews = response.data.reviews;
            if (reviews.length !== 0) {
                let value = 0;
                reviews.map(review => value = value + review.rate);
                setTotalRate((value / reviews.length).toFixed(1));
                setReviewCount(reviews.length);
            }
        }).catch((error) => {
            console.error(error);
            alert('리뷰 데이터를 불러오는데 실패했습니다.')
        });
    }, []);

    const openReviewModal = (e) => setModalVisible(true);

    const handleOk = () => {
        axios.post(
            '/api/review',
            { unitId: props.unitId, rate: userRate }, 
            { headers: { Authorization: token }}
        ).then((response) => {
            if (response.data.success) {
                const reviews = response.data.reviews;
                let value = 0;
                reviews.map(review => value = value + review.rate);
                setTotalRate((value / reviews.length).toFixed(1));
                setReviewCount(reviews.length);
                setModalVisible(false);
            } else {
                alert('평점 남기기에 실패했습니다.');
            }
        }).catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.')
        });
    }

    const handleCancel = () => setModalVisible(false);
    const handleReviewChange = (value) => setUserRate(value);

    return (
        <> 
            <div>
                <span>{totalRate}</span>
                <Rate disabled value={totalRate} />
                <span>{`${reviewCount} 리뷰`}</span>
                <Button type="link" onClick={openReviewModal} disabled={!user} >평점 남기기</Button>
            </div>

            <Modal
                title="평점을 남겨주세요"
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Rate onChange={handleReviewChange} value={userRate} />
            </Modal>
        </>
    )
}

export default ReviewButton;