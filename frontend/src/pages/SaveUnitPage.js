import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import { Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import axios from 'axios';

function SaveUnitPage() {
    const userState = useUserState();
    const { token } = userState;
    const { folderId, unitId, path } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const handleTitleChange = (e) => setTitle(e.target.value);

    const [description, setDescription] = useState('');
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const [isPublic, setIsPublic] = useState("public");
    const handleIspublicChange = (e) => setIsPublic(e.target.value);

    const blankWord = { word: '', meaning: '' };
    const [words, setWords] = useState([
        { ...blankWord },
    ]);

    const addWord = () => setWords([ ...words, { ...blankWord }]);
    

    const removeWord = (idx) => {
        const updatedWords = words.filter((w, i) => i !== Number(idx));
        setWords([ ...updatedWords ]);
    }

    const handleWordChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        const updatedWords = [ ...words ];
        updatedWords[e.target.dataset.idx][name] = value;
        setWords(updatedWords);
    };

    const handleCreate = (e) => {
        e.preventDefault();

        axios.post(
            '/api/units', 
            { title, description, isPublic, words, folderId },
            { headers: { Authorization: token }}
        ).then(response => {
            if (response.data.success) navigate(`/folders/${folderId}`)
            else alert('단어장 생성에 실패했습니다.');
        }).catch(error => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }

    const handleUpdate = (e) => {
        e.preventDefault();

        axios.put(
            `/api/units/${unitId}`, 
            { title, description, isPublic, words },
            { headers: { Authorization: token }}
        ).then(response => {
            if (response.data.success) navigate(`/units/${unitId}`)
            else alert(response.data.message);
        }).catch(error => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }
    
    useEffect(() => {        
        if (path !== "/updateUnit/:unitId") return
        
        axios.get(`/api/units/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitle(response.data.unit.title);
                setDescription(response.data.unit.description);
                setIsPublic(response.data.unit.isPublic);
                setWords([ ...response.data.unit.words ]);
            } else {
                alert('단어장 불러오기를 실패했습니다.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }, []);

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <PageHeader
                title={path === "/updateUnit/:unitId" ? "단어장 수정" : "단어장 생성"}
            >
                <hr />
            </PageHeader>

            <form style={{ width: '80%', margin: '0 auto' }}>
                <Input
                    required max={30} 
                    name="title" value={title}
                    onChange={handleTitleChange}
                    autoFocus prefix="제목 : " size="large"
                    style={{ marginBottom: '20px' }}
                />
                <Input 
                    name="description" value={description}
                    onChange={handleDescriptionChange}
                    prefix="설명 : " size="large" max={100}
                    style={{ marginBottom: '20px' }}
                />
                {path === "/updateUnit/:unitId" ? (<></>) : (
                    <div style={{ width: '100%', marginBottom: '20px', textAlign: 'center' }}>
                        <label>공개 : </label>
                        <input 
                            type="radio" name="isPublic" value="public"
                            onChange={handleIspublicChange}
                            checked={isPublic === "public" ? true : false}
                            style={{marginRight: '10px'}}
                        />
                        <label>비공개 : </label>
                        <input 
                            type="radio" name="isPublic" value="private"
                            onChange={handleIspublicChange}
                            checked={isPublic === "private" ? true : false}
                    />
                    </div>
                )}
                
                <div style={{ textAlign: 'center' }}>
                {words.map((word, index) => { return (
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ marginRight: '10px', display: 'inline' }}>{`#${index + 1}`}</h3>
                        <Input 
                            name="word" data-idx={index} size="large" max={100}
                            value={words[index].word} onChange={handleWordChange}
                            style={{ width: '30%', textAlign: 'center' }}    
                        />
                        <Input 
                            name="meaning" data-idx={index} size="large" max={100}
                            value={words[index].meaning} onChange={handleWordChange}
                            style={{ width: '30%', textAlign: 'center' }}
                        />
                        <Button onClick={() => removeWord(index)} icon={<DeleteOutlined />} size="large"></Button>
                    </div>
                );})}
                </div>

                <Button style={{ display: 'block', margin: '1rem auto' }} onClick={addWord}>Add New Word</Button>

                {path === "/updateUnit/:unitId" ? (
                    <Button onClick={handleUpdate} type="primary" style={{ display: 'block', margin: '1rem auto' }}>수 정</Button>
                ) : (
                    <Button onClick={handleCreate} type="primary" style={{ display: 'block', margin: '1rem auto' }}>생 성</Button>
                )}
            </form>
        </div>
    );
}

export default SaveUnitPage;