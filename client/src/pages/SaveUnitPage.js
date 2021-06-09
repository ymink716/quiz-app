import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';
import axios from 'axios';

function SaveUnitPage(props) {
    const userState = useUserState();
    const { token } = userState;
    const { folderId } = props.match.params;

    const [titleState, setTitleState] = useState('');
    const handleTitleChange = (e) => setTitleState(e.target.value);

    const [descriptionState, setDescriptionState] = useState('');
    const handleDescriptionChange = (e) => setDescriptionState(e.target.value);

    const [isPublicState, setIsPublicState] = useState("public");
    const handleIspublicChange = (e) => setIsPublicState(e.target.value);

    const blankWord = { word: '', meaning: '' };
    const [wordState, setWordState] = useState([
        { ...blankWord },
    ]);

    const addWord = () => {
        setWordState([ ...wordState, { ...blankWord }]);
    };

    const removeWord = (e) => {
        const idx = e.target.getAttribute("data-idx");
        setWordState(wordState.filter((w, i) => i !== idx));
    }

    const handleWordChange = (e) => {
        const updatedWords = [ ...wordState ];
        updatedWords[e.target.dataset.idx][e.target.className] = e.target.value;
        setWordState(updatedWords);
    };

    const handleCreate = (e) => {
        e.preventDefault();

        axios.post(
            '/api/unit', 
            { 
                title: titleState, 
                description: descriptionState, 
                isPublic: isPublicState, 
                words: wordState, 
                folderId 
            },
            { headers: { Authorization: token }}
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

    const handleUpdate = (e) => {
        e.preventDefault();

        const { unitId } = props.match.params;
        axios.put(
            `/api/unit/${unitId}`, 
            { 
                title: titleState, 
                description: descriptionState, 
                isPublic: isPublicState, 
                words: wordState, 
            },
            { headers: { Authorization: token }}
        ).then(response => {
            if (response.data.success) {
                props.history.push(`/folder/${response.data.updatedUnit.folder}`)
            } else {
                alert(response.data.message);
            }
        }).catch(error => {
            console.error(error);
            alert('에러가 발생했습니다.');
        });
    }
    
    useEffect(() => {        
        if (props.match.path !== "/updateUnit/:unitId") return
        const { unitId } = props.match.params;
        
        axios.get(`/api/unit/${unitId}`)
        .then(response => {
            if (response.data.success) {
                setTitleState(response.data.unit.title);
                setDescriptionState(response.data.unit.description);
                setIsPublicState(response.data.unit.isPublic);
                setWordState([ ...response.data.unit.words ]);
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
            <div style={{ marginBottom: '20px' }}> 
                <div style={{ fontSize: '1.5rem', float: 'left' }}>단어장 만들기</div>
                <hr style={{ clear: 'both', width: '100%' }}/>
            </div>

            <form
                onSubmit={props.match.path === "/updateUnit/:unitId" ? handleUpdate : handleCreate} 
                style={{ 
                    border: '0.15rem solid #000',  
                    margin: '1rem auto', 
                    padding: '1rem' }}
            >
                <label htmlFor="title">제목 : </label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value={titleState}
                    onChange={handleTitleChange}
                    style={{ display: 'block' }} />
                <label htmlFor="description">설명 : </label>
                <input 
                    type="text" 
                    name="description" 
                    id="description"
                    value={descriptionState} 
                    onChange={handleDescriptionChange}
                    style={{ display: 'block' }} />

                <label>공개 : </label>
                <input 
                    type="radio"
                    name="isPublic"
                    value="public"
                    onChange={handleIspublicChange}
                    checked={isPublicState === "public" ? true : false}
                />
                <label>비공개 : </label>
                <input 
                    type="radio"
                    name="isPublic"
                    value="private"
                    onChange={handleIspublicChange}
                    checked={isPublicState === "private" ? true : false}
                />

                {
                    wordState.map((val, idx) => {
                        const wordId = `word-${idx}`;
                        const meaningId = `meaning-${idx}`;
                        return (
                            <div key={ `word-${idx}` }>
                                <label htmlFor={wordId}>{`#${idx + 1} Word`}</label>
                                <input
                                    type="text"
                                    name={wordId}
                                    data-idx={idx}
                                    id={wordId}
                                    className="word"
                                    value={wordState[idx].word}
                                    onChange={handleWordChange}                                    
                                />
                                <label htmlFor={meaningId}>Meaning</label>
                                <input
                                    type="text"
                                    name={meaningId}
                                    data-idx={idx}
                                    id={meaningId}
                                    className="meaning"
                                    value={wordState[idx].meaning}
                                    onChange={handleWordChange}
                                />
                                <button data-idx={idx} onClick={removeWord}>삭제</button>
                            </div>
                        );
                    })
                }

                <input 
                    type="button" 
                    value="Add New Word" 
                    style={{ display: 'block', margin: '1rem auto' }} 
                    onClick={addWord}    
                />

                {props.match.path === "/updateUnit/:unitId" ? (
                    <input type="submit" onSubmit={handleUpdate} value="수 정" style={{ display: 'block', margin: '1rem auto' }} />
                ) : (
                    <input type="submit" onSubmit={handleCreate} value="생 성" style={{ display: 'block', margin: '1rem auto' }} />
                )}
            </form>
        </div>
    );
}

export default withRouter(SaveUnitPage);