import React, { useReducer, createContext, useContext } from 'react';
import axios from 'axios';

let user = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser'))
    : null;

let token = localStorage.getItem('token')
    ? JSON.parse(localStorage.getItem('token'))
    : null;

const initialState = {
    loading: false,
    errorMessage: null,
    user: null || user,
    token: null || token
};

function userReducer(state, action) {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                loading: true
            }
        case 'LOGIN_SUCESS':
            return {
                ...state,
                user: action.data.user,
                token: action.data.token,
                loading: false
            }
        case 'LOGIN_ERROR':
            return {
                ...state,
                loading: false,
                errorMessage: action.error.message
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const UserStateContext = createContext(null);
const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}

export function useUserState() {
    const context = useContext(UserStateContext);
    if (!context) {
        throw new Error('Cannot find UserProvider');
    }
    return context;
}

export function useUserDispatch() {
    const context = useContext(UserDispatchContext);
    if (!context) {
        throw new Error('Cannot find UserProvider');
    }
    return context;
}

export async function login(dispatch, payload) {
    dispatch({ type: 'LOGIN_USER' });
    try {
        const response = await axios.post('api/auth/login', payload);
        if(response.data.success) {
            dispatch({ type: 'LOGIN_SUCESS', data: response.data });
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            localStorage.setItem('token', JSON.stringify(response.data.token));
            return response;
        }
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', error: error.response.data });
    }
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
}