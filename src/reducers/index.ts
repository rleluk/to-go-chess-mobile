import {combineReducers} from 'redux';

const initialApp = {
    isLoading: true,
    isSignout: false,
    user: null,
    stackLoading: ['Loading'],
    newAnalysis: false
};

const app = (state = initialApp, action: any) => {
    let array, index;
    switch (action.type) {
        case 'GAME_TREE_UPDATED':
            return {
                ...state,
                gameTree: action.gameTree
            };
        case 'GAME_OBJECT_CREATED':
            return {
                ...state,
                game: action.game
            };
        case 'TREE_MOVEMENT_ENABLED':
            return {
                ...state,
                isTreeEnabled: true
            };
        case 'TREE_MOVEMENT_DISABLED':
            return {
                ...state,
                isTreeEnabled: false
            }
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
        case 'OPEN_DIALOG':
            return {
                ...state,
                dialog: {
                    content: action.content,
                    onClose: action.onClose,
                },
            }
        case 'CLOSE_DIALOG':
            return {
                ...state,
                dialog: {},
            }
        case 'NEW_GAME':
            return {
                ...state,
                config: action.config,
                newGame: true,
            }
        case 'GAME_CREATED':
            return {
                ...state,
                newGame: false,
            }
        case 'NEW_ANALYSIS':
            return {
                ...state,
                newAnalysis: true,
                movesPGN: action.movesPGN
            }
        case 'ANALYSIS_CREATED':
            return {
                ...state,
                newAnalysis: false,
                movesPGN: undefined
            }    
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
