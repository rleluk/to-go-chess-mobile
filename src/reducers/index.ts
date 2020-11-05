import {combineReducers} from 'redux';

const initialApp = {
    isLoading: true,
    isSignout: false,
    user: null,
    stackLoading: ['Loading'],
};

const app = (state = initialApp, action: any) => {
    let array, index;
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                isLoading: true,
                stackLoading: [...state.stackLoading, action.message],
            };
        case 'LOADED':
            array = state.stackLoading;
            index = array.findIndex(element => element === action.message);
            if (index >= 0) array.splice(index, 1);
            return {
                ...state,
                isLoading: array.length > 0,
                stackLoading: array,
            };
        case 'RESTORE_USER':
            array = state.stackLoading;
            index = array.findIndex(element => element === 'Loading');
            if (index >= 0) array.splice(index, 1);
            return {
                ...state,
                user: action.user,
                isLoading: array.length > 0,
                stackLoading: array,
            };
        default:
            return state;
    }
};

const userUpdate = (state = {}, action: any) => {
    switch (action.type) {
        case 'USER_NEEDS_UPDATE':
            return {
                ...state,
                fistName: action.firstName,
                lastName: action.lastName,
            };
        default:
            return state;
    }
};


export default combineReducers({
    app,
    userUpdate,
});
