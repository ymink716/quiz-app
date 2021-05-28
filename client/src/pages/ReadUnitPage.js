import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useUserState } from '../context/UserContext';

function ReadUnitPage(props) {
    const userState = useUserState();
    const { token } = userState;

    return (
        <div style={{ width: '100%', marginLeft: '5%' }}>
            <div style={{ marginBottom: '20px' }}> 
                <div style={{ fontSize: '1.5rem', float: 'left' }}>단어장 읽기 페이지</div>
                <hr style={{ clear: 'both', width: '100%' }}/>
            </div>


        </div>
    )
}

export default withRouter(ReadUnitPage);