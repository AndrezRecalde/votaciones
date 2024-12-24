import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    user: {},
    token: localStorage.getItem('auth_token') || null,
    profile: {},
    validate: undefined,
    errores: undefined,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onAuthenticate: (state, { payload }) => {
            state.user = payload;
            state.isLoading = false;
        },
        onLoadToken: (state, { payload }) => {
            state.token = payload;
        },
        onLoadProfile: (state, { payload }) => {
            state.profile = payload;
            state.isLoading = false;
        },
        onLogout: (state, { payload }) => {
            state.user = {};
            state.errores = payload;
            state.isLoading = false;
        },
        onValidate: (state, { payload }) => {
            state.isLoading = false;
            state.validate = payload;
        },
        onClearValidates: (state) => {
            state.isLoading = false;
            state.validate = undefined;
        },
        onLoadErrores: (state, { payload }) => {
            state.errores = payload;
        },
        onClearErrores: (state) => {
            state.errores = undefined;
        },
    },
});

export const {
    onLoading,
    onAuthenticate,
    onLoadToken,
    onLoadProfile,
    onLogout,
    onValidate,
    onClearValidates,
    onLoadErrores,
    onClearErrores,
} = authSlice.actions;
