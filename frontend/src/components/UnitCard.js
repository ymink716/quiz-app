import React from 'react'
import { Col, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function UnitCard({unit, index}) {
    let link;
    if (unit.type === "words") link = `/units/${unit._id}`;
    else link = `/images/${unit._id}`;

    return (
        <Col className="gutter-row" lg={6} md={8} xs={24}>
            <Card 
                index={index} 
                title={<a href={link}>{unit.title}</a>}
                extra={[
                    <div>
                        <Avatar 
                            size="small" 
                            icon={<UserOutlined />} 
                            style={{marginRight: '5px'}} 
                        />
                        {unit.maker.nickname}
                    </div>    
                ]}
            >
                <p>{`${unit.description}`}</p>
            </Card>
        </Col>
    )
}

export default UnitCard;