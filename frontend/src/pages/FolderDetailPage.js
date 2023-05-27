import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserState } from '../context/UserContext';
import { Button, Modal, Form, Input, Row } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import UnitCard from '../components/UnitCard';

function FolderDetailPage(props) {
    const userState = useUserState();
    const { token } = userState;
    const { folderId } = useParams();

    const [folder, setFolder] = useState('');
    const [units, setUnits] = useState([]);

    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        axios.get(`/api/folder/${folderId}`, { headers: { Authorization: token }})
        .then((response) => {
            if (response.data.success) {
                setFolder(response.data.folder);
                if (response.data.units && response.data.units.length !== 0) 
                    setUnits([...response.data.units]);
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.')
        });
    }, []);

    const updateFolderHandler = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const deleteFolderHandler = () => {
        const check = window.confirm('폴더와 폴더 안 모든 내용이 삭제됩니다. 삭제하시겠습니까?');
        if (!check) return

        axios.delete(`/api/folder/${folderId}`, { headers: {Authorization: token }})
        .then((response) => {
            if (response.data.success) navigate('/myFolder');
            else alert(response.data.message);
        }).catch((error) => {
            console.error(error);
            alert('폴더 삭제에 실패했습니다.');
        });
    } 

    const handleOk = () => {
        form.validateFields()
        .then(values => {
            const { title, description } = values;
            axios.put(
                `/api/folder/${folderId}`, 
                { title, description },
                { headers: {Authorization: token }}
            ).then(response => {
                setFolder(response.data.updatedFolder);
                form.resetFields();
                setIsModalVisible(false);
                window.location.reload();
            }).catch(error => {
                alert('폴더 수정에 실패했습니다.');
            });
        })
        .catch(error => {
            console.error(error);
            alert('입력한 값을 다시 확인해주세요.');
        })
    }

    const renderUnits = units.map((unit, index) => {
        return (
            <UnitCard unit={unit} key={index}></UnitCard>
        )
    });

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title={folder.title}
                subTitle={folder.description}
                extra={[
                    <Button href={`/createUnit/${folderId}`}>단어장 생성</Button>,
                    <Button href={`/createImage/${folderId}`}>이미지 생성</Button>,
                    <Button onClick={updateFolderHandler}>폴더 수정</Button>,
                    <Button onClick={deleteFolderHandler}>폴더 삭제</Button>
                ]}
            >
                <hr />
            </PageHeader>
            
            <Row style={{margin: '0 auto'}} gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
                {renderUnits}
            </Row>

            <Modal 
                title="폴더 수정하기" 
                visible={isModalVisible}
                okText="수정하기"
                cancelText="취소" 
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                <Form 
                    form={form} 
                    id="updateFolder" 
                    layout="vertical"
                    initialValues={{
                        title: folder.title,
                        description: folder.description
                    }}    
                >
                    <Form.Item 
                        label="제목" name="title"
                        rules={[{ required: true, message: '제목(30글자 이내)', max: 30 }]}
                    > 
                        <Input /> 
                    </Form.Item>
                    <Form.Item 
                        label="설명" name="description"
                        rules={[{ message: '설명(100글자 이내)', max: 100 }]}

                    > 
                        <Input /> 
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default FolderDetailPage;
