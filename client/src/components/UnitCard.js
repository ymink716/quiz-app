import React from 'react'
import { Col, Card } from 'antd';

function UnitCard({unit, index}) {
    let link;
    if (unit.type === "words") link = `/unit/${unit._id}`;
    else link = `/image/${unit._id}`;

    return (
        <Col className="gutter-row" lg={6} md={8} xs={24}>
            <Card index title={unit.title} extra={<a href={link}>열기</a>}>
                <p>{unit.description}</p>
            </Card>
        </Col>
    )
}

export default UnitCard;