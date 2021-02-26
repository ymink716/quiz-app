import React from 'react'
import { Col, Card } from 'antd';

function FolderCard({folder, index}) {
    const link = `/folder/${folder._id}`;

    return (
        <Col className="gutter-row" span={6}>
            <Card title={folder.title} extra={<a href={link}>열기</a>}>
                <p>{folder.description}</p>
                <p>{index}</p>
            </Card>
        </Col>
    )
}

export default FolderCard;
