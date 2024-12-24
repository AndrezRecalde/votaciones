import { createSlice } from "@reduxjs/toolkit";

export const escrutinioSlice = createSlice({
    name: "escrutinio",
    initialState: {
        resultadosEscrutinio: [],
        progressEscrutinio: [],
        errores: undefined,
    },
    reducers: {
        onLoadEscrutinios: (state, { payload }) => {
            state.resultadosEscrutinio = payload;
        },
        onProgressEscrutinios: (state, { payload }) => {
            state.progressEscrutinio = payload;
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
    onLoadEscrutinios,
    onProgressEscrutinios,
    onClearEscrutinios,
    onLoadErrores,
} = escrutinioSlice.actions;
