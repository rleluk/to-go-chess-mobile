import {combineReducers} from 'redux';

const initialApp = {
    isLoading: true,
    isSignout: false,
    user: null,
    rotateAutomatically: false,
    chessboardRotated: false,
    stackLoading: ['Loading'],
    newAnalysis: false,
    toast: {},
    botLevel: 10,
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
        case 'OPEN_TOAST':
            return {
                ...state,
                toast: {
                    content: action.content,
                    options: action.options,
                },
            }
        case 'CLOSE_TOAST':
            return {
                ...state,
                toast: {},
            }
        case 'NEW_GAME':
            return {
                ...state,
                config: action.config,
                status: 'inProgress',
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
        case 'DRAW_OFFERED':
            return {
                ...state,
                status: 'drawOffered',
            }
        case 'SURRENDERED':
            return {
                ...state,
                status: 'surrendered',
            }
        case 'GAME_IN_PROGRESS':
            return {
                ...state,
                status: 'inProgress',
            }
        case 'SEND_EMOTE':
            return {
                ...state,
                emoteToSend: action.index,
            }
        case 'EMOTE_SENT':
            return {
                ...state,
                emoteToSend: undefined,
            }
        case 'TOGGLE_CHESSBOARD_ROTATION':
            return {
                ...state,
                rotateAutomatically: !state.rotateAutomatically
            }
        case 'CHESSBOARD_ROTATED':
            return {
                ...state,
                chessboardRotated: !state.chessboardRotated
            }
        case 'BOT_LEVEL_CHANGED':
            return {
                ...state,
                botLevel: action.botLevel
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
