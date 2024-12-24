import { createSlice } from "@reduxjs/toolkit";

export const escrutinioSlice = createSlice({
    name: "escrutinio",
    initialState: {
        isLoading: false,
        resultadosEscrutinio: [],
        progressEscrutinio: [],
        errores: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadEscrutinios: (state, { payload }) => {
            state.resultadosEscrutinio = payload;
            state.isLoading = false;
        },
        onProgressEscrutinios: (state, { payload }) => {
            state.progressEscrutinio = payload;
            state.isLoading = false;
        },
        onClearEscrutinios: (state) => {
            state.resultadosEscrutinio = [];
            state.progressEscrutinio = [];
            state.errores = undefined;
        },
        onLoadErrores: (state, { payload }) => {
            state.errores = payload;
        },
    },
});

export const {
    onLoading,
    onLoadEscrutinios,
    onProgressEscrutinios,
    onClearEscrutinios,
    onLoadErrores,
} = escrutinioSlice.actions;
