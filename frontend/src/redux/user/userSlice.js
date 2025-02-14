import { createSlice } from '@reduxjs/toolkit'

const initalState = {
    currentUser: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initalState,
    reducers: {
        signInStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        updateUserStart: (state) => {
            state.isLoading = false;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        deleteUserStart: (state) => {
            state.isLoading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.isLoading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        LogoutStart: (state) => {
            state.isLoading = true;
        },
        LogoutSuccess: (state) => {
            state.currentUser = null;
            state.isLoading = false;
            state.error = null;
        },
        LogoutFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    }
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    LogoutStart,
    LogoutSuccess,
    LogoutFailure,
 } = userSlice.actions;
export default userSlice.reducer;