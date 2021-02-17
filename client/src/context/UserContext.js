import React, { useReducer, createContext, useContext } from 'react';
import axios from 'axios';

const initialState = {
    loading: false,
    error: null,
    user: null,
    token: null
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
                user: action.user,
                token: action.token,
                loading: false
            }
        case 'LOGIN_ERROR':
            return {
                ...state,
                loading: false,
                error: action.error
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

const URL = 'http://localhost:5000/api';

export async function login(dispatch, user) {
    dispatch({ type: 'LOGIN_USER' });
    try {
        const response = await axios.post(`${URL}/auth/login`, user);
        if (response.data) {
            dispatch({ type: 'LOGIN_SUCCESS', user: response.data.user });
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            localStorage.setItem('token', JSON.stringify(response.data.token));
            return response.data;
        }
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR ', error });
    }
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
}