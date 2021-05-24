import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { useUserState } from '../context/UserContext';
import { Button, Form, Input, Radio, Upload, Space } from 'antd';
import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

function UnitDetailPage(props) {
    const userState = useUserState();
    const { token } = userState;
    const { folderId } = props.match.params;

    const [image, setImage] = useState("");

    const uploadImage = async (options) => {
        const { onSuccess, onError, file } = options;

        const formData = new FormData;
        formData.append("image", file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    Authorization: token,
                    'content-type': 'multipart/form-data'
                }
            });
            setImage(response.data.image);
            onSuccess("Ok");
        } catch (error) {
            onError(error);
        }
    }
    
    const uploadProps = {
        accept: "image/*",
        maxCount: 1,
        customRequest: uploadImage,
    }

    const onFinish = (values) => {
        const {title, description, isPublic, words} = values;
        axios.post(
            '/api/unit', 
            { title, description, isPublic, image, words, folderId },
            {headers: { Authorization: token ? token : '' }}
        ).then(response => {
            if (response.data.success) {
                props.history.push(`/folder/${folderId}`)
            } else {
                alert('단어장 생성에 실패했습니다.');
            }
        }).catch(error => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }

    const [form] = Form.useForm();

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2>새로운 단어장 만들기</h2>
                <hr/>
            </div>
            
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="title" label="제목 :" rules={[{ required: true, message: '필수사항입니다.' }]}>
                    <Input autoFocus placeholder="제목을 입력하세요."/>
                </Form.Item>
                <Form.Item name="description" label="설명 :">
                    <Input placeholder="설명을 입력하세요."/>
                </Form.Item>
                <Form.Item name="isPublic" label="공개여부 :" rules={[{ required: true, message: '필수사항입니다.' }]}>
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

                <Form.List name="words">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'word']}
                                    fieldKey={[field.fieldKey, 'word']}
                                    rules={[{ required: true, message: 'Missing word' }]}
                                >
                                    <Input placeholder="word" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'meaning']}
                                    fieldKey={[field.fieldKey, 'meaning']}
                                    rules={[{ required: true, message: 'Missing meaning' }]}
                                >
                                    <Input placeholder="meaning" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                        ))}
                        <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add field
                        </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                
                <Button type="primary" size="large" htmlType="submit">만들기</Button>
            </Form>
        </div>
    )
}

export default withRouter(UnitDetailPage);
