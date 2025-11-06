import { createSlice } from "@reduxjs/toolkit";

export const actaConsultaSlice = createSlice({
    name: "actaConsulta",
    initialState: {
        loading: false,
        loadingActaConsulta: false,
        disabledSearch: false,
        existeActaConsulta: false,

        actasConsulta: [],
        actasPaginacion: {
            total: 0,
            por_pagina: 15,
            pagina_actual: 1,
            ultima_pagina: 0,
        },
        juntaInfo: null,
        //actaExistente: null,
        pregunta: {},
        message: undefined,
        errores: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.loading = payload;
        },
        onActiveSearch: (state, { payload }) => {
            state.disabledSearch = payload;
        },
        onLoadActasConsulta: (state, { payload }) => {
            state.actasConsulta = payload;
            state.loadingActaConsulta = true;
            state.loading = false;
        },
        onLoadPaginacionActasConsulta: (state, { payload }) => {
            state.actasPaginacion = payload;
        },
        onActivateJunta: (state, { payload }) => {
            state.juntaInfo = payload;
            state.loadingActaConsulta = true;
            state.loading = false;
        },
        onSetActaExistente: (state, { payload }) => {
            //state.actaExistente = payload;
            state.existeActaConsulta = payload;
            state.loading = false;
        },
        onActivatePregunta: (state, { payload }) => {
            state.pregunta = payload;
            state.loading = false;
        },
        onClearActaConsulta: (state) => {
            state.loadingActaConsulta = false;
            state.disabledSearch = false;
            state.existeActaConsulta = false;
            state.juntaInfo = null;
            //state.actaExistente = null;
            state.pregunta = {};
            state.message = undefined;
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
    onActiveSearch,
    onLoadActasConsulta,
    onLoadPaginacionActasConsulta,
    onActivateJunta,
    onSetActaExistente,
    onActivatePregunta,
    onClearActaConsulta,
    onLoadMessage,
    onLoadErrores,
} = actaConsultaSlice.actions;
