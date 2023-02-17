import * as actions from '../actions';
import { getCookie } from '../../../services/session';
const initialState = {
    isAuthenticate: !getCookie('token','') ? false : true
}

const authReducer = ( state = initialState, action) => {
    switch(action.type) {
        case actions.LOGIN : 
            return {
                ...state,
                isAuthenticate: true
            }
        case actions.LOGOUT : 
            return {
                ...state,
                isAuthenticate: false
            }    
    }
    return state;
}

export default authReducer;