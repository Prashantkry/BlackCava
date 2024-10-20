import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface userState {
    isLogined: boolean,
    userEmail: string,
    isAdmin: boolean,
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogined: false,
        userEmail: '',
        isAdmin:false,
    },
    reducers: {
        login(state, action: PayloadAction<userState>) {
            state.isLogined = true;
            state.userEmail = action.payload.userEmail;
            state.isAdmin = action.payload.isAdmin;
        },
        logout(state) {
            state.isLogined = false;
            state.userEmail = '';
            state.isAdmin = false;
        }
    },
})

export const { login,logout } = userSlice.actions;

// Export reducer
export default userSlice.reducer;