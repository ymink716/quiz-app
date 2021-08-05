import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { useUserState } from '../context/UserContext';
import { Button, Form, Input, Radio, Upload, PageHeader } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

function SaveImagePage(props) {
    const userState = useUserState();
    const { token } = userState;
    const { folderId } = props.match.params;

    const [image, setImage] = useState(null);
    
    const uploadProps = {
        accept: "image/*",
        maxCount: 1,
        beforeUpload: file => {
            setImage(file);
            return false;
        }
    }

    const onFinish = (values) => {
        const { title, description, isPublic } = values;
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("isPublic", isPublic);
        formData.append("folderId", folderId);

        axios.post(
            '/api/image', 
            formData,
            { headers: { 
                Authorization: token,
                'content-type': 'multipart/form-data'
            }}
        ).then(response => {
            if (response.data.success) props.history.push(`/folder/${folderId}`)
            else alert('이미지 생성에 실패했습니다.');
        }).catch(error => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }

    const [form] = Form.useForm();

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader title="새 이미지">
                <hr/>
            </PageHeader>

            <Form 
                form={form} 
                onFinish={onFinish}
                requiredMark={false}
                style={{ width: '80%', margin: '0 auto' }}
            >
                <Form.Item 
                    name="title" label="제목 :" 
                    rules={[{ required: true, max:30, message: '필수사항입니다. (30글자 이내)' }]}>
                    <Input autoFocus placeholder="제목을 입력하세요."/>
                </Form.Item>
                <Form.Item 
                    name="description" label="설명 :"
                    rules={[{ max: 100, message: '(100글자 이내)' }]}
                >
                    <Input placeholder="설명을 입력하세요."/>
                </Form.Item>
                <Form.Item 
                    name="isPublic" label="공개여부 :" 
                    rules={[{ required: true, message: '필수사항입니다.' }]}
                >
                    <Radio.Group >
                        <Radio value="public">공개</Radio>
                        <Radio value="private">비공개</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="image">
                    <Upload.Dragger { ...uploadProps}>
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">이미지를 드래그하거나 선택하세요.</p>
                    </Upload.Dragger>
                </Form.Item>
                
                <Button 
                    type="primary" size="large" htmlType="submit" 
                    style={{ display: 'block', margin: '1rem auto' }}
                >
                    생 성
                </Button>
            </Form>
        </div>
    )
}

export default withRouter(SaveImagePage);