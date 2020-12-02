export const restoreUser = (user: any) => ({
    type: 'RESTORE_USER',
    user,
});

export const loading = (message: string) => ({
    type: 'LOADING',
    message,
});

export const loaded = (message: string) => ({
    type: 'LOADED',
    message,
});

export const openDialog = (content: any, onClose?: any) => ({
    type: 'OPEN_DIALOG',
    content,
    onClose,
});

export const closeDialog = () => ({
    type: 'CLOSE_DIALOG',
});

export const createGame = (config: any) => ({
    type: 'NEW_GAME',
    config
});

export const gameCreated = () => ({
    type: 'GAME_CREATED',
});

export const gameObjectCreated = (game: any) => ({
    type: 'GAME_OBJECT_CREATED',
    game
});

export const gameTreeUpdated = (gameTree: any) => ({
    type: 'GAME_TREE_UPDATED',
    gameTree
});

export const enableTreeMovement = () => ({
    type: 'TREE_MOVEMENT_ENABLED'
});

export const disableTreeMovement = () => ({
    type: 'TREE_MOVEMENT_DISABLED'
});

export const createAnalysis = (movesPGN?: string) => ({
    type: 'NEW_ANALYSIS',
    movesPGN
});

export const analysisCreated = () => ({
    type: 'ANALYSIS_CREATED',
});