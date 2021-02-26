import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { Modal, Button, Form, Input, Radio, Row } from 'antd';
import axios from 'axios';
import FolderCard from '../components/FolderCard';

function MyFolderPage(props) {
    const state = useUserState();
    const { token } = state;

    const [folders, setFolders] = useState([]);

    useEffect(() => {
        if (folders.length > 0) return
        axios.get('/api/folder/myFolders', { headers: {Authorization: token ? token : ''}})
        .then(response => {
            if (response.data.success) {
                setFolders(response.data.folders);
            } else {
                alert('폴더 가져오기를 실패했습니다.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('폴더 가져오기를 실패했습니다.');
        });
    }, [folders]);

    const randerFolders = folders.map((folder, index) => {
        return (
            <FolderCard folder={folder} key={index}></FolderCard>
        )
    });

    const [form] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form
        .validateFields()
        .then(values => {
            const { title, description, isPublic } = values;
            axios.post(
                '/api/folder', 
                { title, description, isPublic },
                { headers: {Authorization: token ? token : ''}}
            ).then(response => {
                setFolders([...folders, response.data.newFolder]);
                //props.history.push('/myFolder');
            }).catch(error => {
                alert('폴더 생성에 실패했습니다.');
            });
            form.resetFields();
            setIsModalVisible(false);
        })
        .catch(error => {
            console.error(error);
            alert('입력한 값을 다시 확인해주세요.');
        })
    }
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <div style={{ marginBottom: '20px' }}> 
                <div style={{ fontSize: '1.5rem', float: 'left' }}>내 폴더</div>
                <Button style={{ float: 'right' }} type="primary" onClick={showModal} >새 폴더 만들기</Button>
                <hr style={{ clear: 'both', width: '100%' }}/>
            </div>

            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                {randerFolders}
            </Row>
            <Modal 
                title="새 폴더 만들기" 
                visible={isModalVisible}
                okText="만들기"
                cancelText="취소" 
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                <Form form={form} id="newFolder" layout="vertical">
                    <Form.Item 
                        label="제목" 
                        name="title" 
                        rules={[{ required: true, message: '필수사항압니다.' }]}>
                        <Input placeholder="제목을 입력하세요." />
                    </Form.Item>
                    <Form.Item label="설명" name="description">
                        <Input placeholder="설명을 입력하세요." />
                    </Form.Item>
                    <Form.Item name="isPublic" label="공개 여부">
                        <Radio.Group rules={[{ required: true, message: '필수사항압니다.' }]}>
                            <Radio value="public">공개</Radio>
                            <Radio value="private">비공개</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
    </div>
    )
}

export default withRouter(MyFolderPage);
