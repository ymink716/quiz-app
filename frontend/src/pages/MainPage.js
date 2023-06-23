import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';
import { Row } from 'antd';
import UnitCard from '../components/UnitCard';
import qs from 'qs';

function MainPage() {
  const [units, setUnits] = useState([]);
  const { search } = useLocation();
  
  const query = qs.parse(search, {
    ignoreQueryPrefix: true
  });
  const searchText = query.search;

  useEffect(() => {
    if (searchText) {
      axios.get(`/api/units/search/${searchText}`)
      .then(response => {
        if (response.data.units && response.data.units.length !== 0) 
          setUnits([...response.data.units]);
      }).catch(error => {
        console.error(error);
        alert('에러가 발생했습니다.')
      });
    } else {
      axios.get('/api/units')
      .then(response => setUnits([...response.data.units]));
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
      <PageHeader title={`검색 결과 "${searchText}" (${units.length} 건)`} >
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
)}

export default MainPage;