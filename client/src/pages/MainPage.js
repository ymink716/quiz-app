import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { PageHeader } from 'antd';
import axios from 'axios';
import { Row } from 'antd';
import UnitCard from '../components/UnitCard';
import qs from 'qs';


function MainPage(props) {
    const [units, setUnits] = useState([]);

    const query = qs.parse(props.location.search, {
        ignoreQueryPrefix: true
    });
    const searchText = query.search;

    useEffect(() => {
        if (searchText) {
            axios.get(`/api/unit/search/${searchText}`)
            .then(response => {
                setUnits(response.data.units);
            }).catch(error => {
                console.error(error);
                alert('데이터를 불러오는데 실패했습니다.');
            })
        } else {
            axios.get('/api/unit')
            .then(response => {
                setUnits(response.data.units);
            }).catch(error => {
                console.error(error);
                alert('데이터를 불러오는데 실패했습니다.');
            });
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