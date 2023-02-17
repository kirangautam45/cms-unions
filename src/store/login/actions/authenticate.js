import * as actions from './index'; 

import { setCookie, removeCookie } from '../../../services/session';

export const login = (token) => {
    setCookie('token',`Bearer ${token}`);
    return {
        type: actions.LOGIN
    }
}

export const logout = () => {
    removeCookie('token');
    return {
        type: actions.LOGOUT
    }
}
