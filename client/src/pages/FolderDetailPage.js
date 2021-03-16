import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { useUserState } from '../context/UserContext';
import { PageHeader, Button, Modal, Form, Input } from 'antd';

function FolderDetailPage(props) {
    const userState = useUserState();
    const { token } = userState;

    const [folder, setFolder] = useState([]);
    const [units, setUnits] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { folderId } = props.match.params;

    useEffect(() => {
        axios.get(`/api/folder/${folderId}`, { headers: {Authorization: token ? token : ''}})
        .then((response) => {
            if (response.data.success) {
                setFolder(response.data.folder);
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.')
        });

        // 폴더 안 유닛 가져오기

    }, []);

    const addUnitHandler = () => {
        props.history.push(`/createUnit/${folderId}`);
    }

    const updateFolderHandler = () => {
        setIsModalVisible(true);
    }

    const deleteFolderHandler = () => {
        const check = window.confirm('폴더와 폴더 안 모든 내용이 삭제됩니다. 삭제하시겠습니까?');
        if (!check) return

        axios.delete(`/api/folder/${folderId}`, { headers: {Authorization: token ? token : ''}})
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
                { headers: {Authorization: token ? token : ''}}
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

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title={folder.title}
                subTitle={folder.description}
                extra={[
                    <Button onClick={addUnitHandler}>유닛 추가</Button>,
                    <Button onClick={updateFolderHandler}>폴더 수정</Button>,
                    <Button onClick={deleteFolderHandler}>폴더 삭제</Button>
                ]}
            >
                <hr style={{ width: '100%' }}/>
            </PageHeader>

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
