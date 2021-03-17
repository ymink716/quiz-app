import React from 'react'
import { Col, Card } from 'antd';

function UnitCard({unit, index}) {
    const link = `/unit/${unit._id}`;

    return (
        <Col className="gutter-row" lg={6} md={8} xs={24}>
            <Card title={unit.title} extra={<a href={link}>열기</a>}>
                <p>{unit.description}</p>
            </Card>
        </Col>
    )
}

export default UnitCard;