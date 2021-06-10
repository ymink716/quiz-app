import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { PageHeader, Row } from 'antd';
import axios from 'axios';
import UnitCard from '../components/UnitCard';

function BookmarkPage(props) {
    const userState = useUserState();
    const { token } = userState;

    const [units, setUnits] = useState([]);

    useEffect(() => {
        axios.get('/api/bookmark/users', { headers: { Authorization: token }})
        .then((response) => {
            if (response.data.success) {
                const arr = [];
                response.data.bookmarks.map(bookmark => {
                    arr.push(bookmark.unitId);
                });
                setUnits(arr);
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.')
        });
    }, []);

    const randerUnits = units.map((unit, index) => {
        return (
            <UnitCard unit={unit} key={index}></UnitCard>
        )
    });

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="북마크"
                subTitle={`총 ${units.length}개`}
            >
                <hr style={{ width: '100%' }}/>
            </PageHeader>
            
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                {randerUnits}
            </Row>
        </div>
    )
}

export default withRouter(BookmarkPage);
