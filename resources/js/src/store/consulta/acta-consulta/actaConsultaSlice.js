import { createSlice } from "@reduxjs/toolkit";

export const actaConsultaSlice = createSlice({
    name: "actaConsulta",
    initialState: {
        loading: false,
        loadingActaConsulta: false,
        disabledSearch: false,

        actasConsulta: [],
        ultimosFiltros: {
            categoria_id: null,
            nombre_producto: null,
            activo: null,
            page: 1,
            per_page: 20,
        },
        actasPaginacion: {
            total: 0,
            por_pagina: 15,
            pagina_actual: 1,
            ultima_pagina: 0,
        },

        juntaInfo: null,
        info_acta: null,
        preguntas: [],

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
        onLoadUltimosFiltrosActasConsulta: (state, { payload }) => {
            state.ultimosFiltros = payload;
        },
        onActivateJunta: (state, { payload }) => {
            state.juntaInfo = payload;
            state.loadingActaConsulta = true;
            state.loading = false;
        },
        onActivateInfoActa: (state, { payload }) => {
            state.info_acta = payload;
            state.loading = false;
        },
        onActivatePreguntas: (state, { payload }) => {
            state.preguntas = payload;
            state.loading = false;
        },
        onClearActaConsulta: (state) => {
            state.loadingActaConsulta = false;
            state.disabledSearch = false;
            state.juntaInfo = null;
            state.info_acta = null;
            //state.actaExistente = null;
            state.preguntas = [];
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
    onLoadUltimosFiltrosActasConsulta,
    onActivateJunta,
    onActivateInfoActa,
    onActivatePreguntas,
    onClearActaConsulta,
    onLoadMessage,
    onLoadErrores,
} = actaConsultaSlice.actions;
