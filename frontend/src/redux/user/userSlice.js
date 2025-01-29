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
        }
    }
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;