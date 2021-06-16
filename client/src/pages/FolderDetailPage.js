import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { useUserState } from '../context/UserContext';
import { PageHeader, Button, Modal, Form, Input, Row } from 'antd';
import UnitCard from '../components/UnitCard';

function FolderDetailPage(props) {
    const userState = useUserState();
    const { token } = userState;
    const { folderId } = props.match.params;

    const [folder, setFolder] = useState([]);
    const [units, setUnits] = useState([]);

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        axios.get(`/api/folder/${folderId}`, { headers: { Authorization: token }})
        .then((response) => {
            if (response.data.success) {
                setFolder(response.data.folder);
                setUnits(response.data.units);
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.')
        });
    }, []);

    const addUnitHandler = () => props.history.push(`/createUnit/${folderId}`);
    const addImageHandler = () => props.history.push(`/createImage/${folderId}`);
    const updateFolderHandler = () => setIsModalVisible(true);

    const deleteFolderHandler = () => {
        const check = window.confirm('폴더와 폴더 안 모든 내용이 삭제됩니다. 삭제하시겠습니까?');
        if (!check) return

        axios.delete(`/api/folder/${folderId}`, { headers: {Authorization: token }})
        .then((response) => {
            if (response.data.success) {
                props.history.push('/myFolder');
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.error(error);
            alert('폴더 삭제에 실패했습니다.');
        });
    } 

    const handleOk = () => {
        form
        .validateFields()
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

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
                    <Button onClick={addUnitHandler}>단어장 생성</Button>,
                    <Button onClick={addImageHandler}>이미지 생성</Button>,
                    <Button onClick={updateFolderHandler}>폴더 수정</Button>,
                    <Button onClick={deleteFolderHandler}>폴더 삭제</Button>
                ]}
            >
                <hr style={{ width: '100%' }}/>
            </PageHeader>
            
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
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
                    <Form.Item label="제목" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="설명" name="description">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default withRouter(FolderDetailPage);
