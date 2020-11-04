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
