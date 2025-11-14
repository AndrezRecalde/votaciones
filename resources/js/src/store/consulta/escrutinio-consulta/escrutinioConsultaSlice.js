import { createSlice } from "@reduxjs/toolkit";

export const escrutinioConsultaSlice = createSlice({
    name: "escrutinioConsulta",
    initialState: {
        isLoading: false,
        escrutinioConsulta: [],
        progresoEscrutinioConsulta: [],
        resumenUsuario: null,
        resumenGeneral: null,
        reporte: null,
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
         onSetResumenUsuario: (state, { payload }) => {
            state.resumenUsuario = payload;
        },
        onSetResumenGeneral: (state, { payload }) => {
            state.resumenGeneral = payload;
        },
        onSetReporte: (state, { payload }) => {
            state.reporte = payload;
            state.isLoading = false;
        },
        onClearEscrutinioConsulta: (state) => {
            state.escrutinioConsulta = [];
            state.progresoEscrutinioConsulta = [];
            state.resumenUsuario = null;
            state.resumenGeneral = null;
            state.reporte = null;
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
    onSetResumenUsuario,
    onSetResumenGeneral,
    onSetReporte,
    onClearEscrutinioConsulta,
    onLoadErrores,
} = escrutinioConsultaSlice.actions;
