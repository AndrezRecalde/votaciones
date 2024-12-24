import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    roles: [],
    errores: undefined
};

export const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadRoles: (state, { payload }) => {
            state.roles = payload;
            state.isLoading = false;
        },
        onLoadErrores: (state, { payload }) => {
            state.errores = payload;
        },
        onClearRoles: (state) => {
            state.roles = [];
        },
    },
});

export const { onLoading, onLoadRoles, onLoadErrores, onClearRoles } = roleSlice.actions;
