import React from 'react'
import { Col, Card } from 'antd';

function FolderCard({folder, index}) {
    const link = `/folder/${folder._id}`;

    return (
        <Col className="gutter-row" lg={6} md={8} xs={24}>
            <Card title={folder.title} extra={<a href={link}>열기</a>}>
                <p>{folder.description}</p>
            </Card>
        </Col>
    )
}

export default FolderCard;
