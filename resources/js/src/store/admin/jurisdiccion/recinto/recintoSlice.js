import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    recintos: [],
    /* activateCanton: null, */
    message: undefined,
    errores: undefined,
};

export const recintoSlice = createSlice({
    name: "recinto",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadRecintos: (state, { payload }) => {
            state.recintos = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearRecintos: (state) => {
            state.recintos = [];
            state.errores = undefined;
        },
        onLoadMessage: (state, { payload }) => {
            state.message = payload;
        },
        onLoadErrores: (state, { payload }) => {
            state.errores = payload;
        },
    },
});

export const {
    onLoading,
    onLoadRecintos,
    onClearRecintos,
    onLoadMessage,
    onLoadErrores,
} = recintoSlice.actions;
