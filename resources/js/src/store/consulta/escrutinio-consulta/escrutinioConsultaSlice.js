import { createSlice } from "@reduxjs/toolkit";

export const escrutinioConsultaSlice = createSlice({
    name: "escrutinioConsulta",
    initialState: {
        isLoading: false,
        escrutinioConsulta: [],
        progresoEscrutinioConsulta: [],
        errores: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadEscrutinioConsulta: (state, { payload }) => {
            state.escrutinioConsulta = payload;
            state.isLoading = false;
        },
        onProgresoEscrutinioConsulta: (state, { payload }) => {
            state.progresoEscrutinioConsulta = payload;
            state.isLoading = false;
        },
        onClearEscrutinioConsulta: (state) => {
            state.escrutinioConsulta = [];
            state.progresoEscrutinioConsulta = [];
            state.errores = undefined;
        },
        onLoadErrores: (state, { payload }) => {
            state.errores = payload;
        },
    },
});

export const {
    onLoading,
    onLoadEscrutinioConsulta,
    onProgresoEscrutinioConsulta,
    onClearEscrutinioConsulta,
    onLoadErrores,
} = escrutinioConsultaSlice.actions;
