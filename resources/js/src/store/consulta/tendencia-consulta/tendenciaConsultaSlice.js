import { createSlice } from "@reduxjs/toolkit";

export const tendenciaConsultaSlice = createSlice({
    name: "tendenciaConsulta",
    initialState: {
        pageLoad: false,
        isLoading: false,
        tendenciasConsulta: [],
        errores: undefined,
        message: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadTendenciasConsulta: (state, { payload }) => {
            state.tendenciasConsulta = payload;
            state.pageLoad = true;
            state.isLoading = false;
        },
        onClearTendenciasConsulta: (state) => {
            state.tendenciasConsulta = [];
            state.pageLoad = false;
            state.isLoading = false;
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
    onLoadTendenciasConsulta,
    onClearTendenciasConsulta,
    onLoadMessage,
    onLoadErrores,
} = tendenciaConsultaSlice.actions;
