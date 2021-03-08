import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { useUserState } from '../context/UserContext';
import { Button } from 'antd';

function CreateUnitPage() {
    const userState = useUserState();
    const { token } = userState;

    return (
        <div>
            유닛 생성 페이지
        </div>
    )
}

export default withRouter(CreateUnitPage);
