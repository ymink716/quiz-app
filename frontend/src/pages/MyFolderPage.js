import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { Modal, Button, Form, Input, Row, PageHeader } from 'antd';
import axios from 'axios';
import FolderCard from '../components/FolderCard';

function MyFolderPage() {
    const userState = useUserState();
    const { token } = userState;

    const [folders, setFolders] = useState([]);

    useEffect(() => {
        axios.get('/api/folder/myFolders', { headers: {Authorization: token }})
        .then(response => {
            if (response.data.folders && response.data.folders.length !== 0) 
                setFolders([...response.data.folders]);
        }).catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }, []);

    const renderFolders = folders.map((folder, index) => {
        return (
            <FolderCard folder={folder} key={index}></FolderCard>
        )
    });

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const handleOk = () => {
        form
        .validateFields()
        .then(values => {
            const { title, description } = values;
            axios.post(
                '/api/folder', 
                { title, description },
                { headers: {Authorization: token }}
            ).then(response => {
                setFolders([...folders, response.data.newFolder]);
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

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title="내 폴더"
                extra={[ <Button onClick={showModal} >새 폴더</Button>]}
            >
                <hr />
            </PageHeader>

            <Row style={{margin: '0 auto'}} gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                {renderFolders}
            </Row>
            
            <Modal 
                title="새 폴더" 
                visible={isModalVisible}
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                <Form 
                    form={form} 
                    id="newFolder" 
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item 
                        label="제목 :" name="title" 
                        rules={[{ required: true, message: '필수사항(30글자 이내)', max: 30 }]}
                    >
                        <Input placeholder="제목을 입력하세요." />
                    </Form.Item>
                    <Form.Item 
                        label="설명 :" name="description"
                        rules={[{ message: '설명(100글자 이내)', max: 100 }]}
                    >
                        <Input placeholder="설명을 입력하세요." />
                    </Form.Item>
                </Form>
            </Modal>
    </div>
    )
}

export default withRouter(MyFolderPage);
