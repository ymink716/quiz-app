import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { useUserState } from '../context/UserContext';
import axios from 'axios';
import { Row } from 'antd';
import UnitCard from '../components/UnitCard';

const { Content } = Layout;

function MainPage() {
    const state = useUserState();
    const { token } = state;

    const [units, setUnits] = useState([]);

    useEffect(() => {
        axios.get('/api/unit')
        .then(response => {
            if (response.data.success) {
                setUnits(response.data.units);
            } else {
                alert(response.data.message);
            }
        }).catch(error => {
            console.error(error);
            alert('데이터를 불러오는데 실패했습니다.');
        });
    }, []);

    const randerUnits = units.map((unit, index) => {
        return (
            <UnitCard unit={unit} key={index}></UnitCard>
        )
    });

    return (
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <div>
                <h2>Home</h2>
                <hr/>
            </div>

            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                {randerUnits}
            </Row>

        </Content>
    )
}

export default withRouter(MainPage);