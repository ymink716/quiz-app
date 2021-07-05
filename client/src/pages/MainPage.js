import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, PageHeader } from 'antd';
import axios from 'axios';
import { Row } from 'antd';
import UnitCard from '../components/UnitCard';
import qs from 'qs';

const { Content } = Layout;

function MainPage(props) {
    const [units, setUnits] = useState([]);

    const query = qs.parse(props.location.search, {
        ignoreQueryPrefix: true
    });
    const searchText = query.search;

    useEffect(async () => {
        try {
            let response;
            if (searchText) response = await axios.get(`/api/unit/search/${searchText}`);
            else response = await axios.get('/api/unit');
            
            if (response.data.success) setUnits(response.data.units);
            else alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('데이터를 불러오는데 실패했습니다.');
        }
    }, []);

    const renderUnits = units.map((unit, index) => {
        return (
            <UnitCard unit={unit} key={index}></UnitCard>
        )
    });

    return (
        <div style={{ width: '100%', marginLeft: '5%'}}>
            {searchText ? (
                <PageHeader title={`검색 결과 총 ${units.length} Set`} >
                    <hr />
                </PageHeader>
            ) : (
                <PageHeader title="Home" >
                    <hr />
                </PageHeader>
            )}
           
            <Row style={{margin: '0 auto'}} gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                {renderUnits}
            </Row>
        </div>
    )
}

export default withRouter(MainPage);