import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalUsuario: false,
    isOpenModalStatusUsuario: false,
    isOpenModalPassword: false,
};

export const uiUsuarioSlice = createSlice({
    name: "uiUsuario",
    initialState,
    reducers: {
        onOpenModalUsuario: (state, { payload }) => {
            state.isOpenModalUsuario = payload;
        },
        onOpenModalStatusUsuario: (state, { payload }) => {
            state.isOpenModalStatusUsuario = payload;
        },
        onOpenModalPassword: (state, { payload }) => {
            state.isOpenModalPassword = payload;
        },
    },
});

export const {
    onOpenModalUsuario,
    onOpenModalStatusUsuario,
    onOpenModalPassword,
} = uiUsuarioSlice.actions;
