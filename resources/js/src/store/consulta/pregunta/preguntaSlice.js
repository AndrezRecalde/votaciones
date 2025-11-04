import { createSlice } from "@reduxjs/toolkit";

export const preguntaSlice = createSlice({
    name: "pregunta",
    initialState: {
        isLoading: false,
        preguntas: [],
        paginacion: {
            total: 0,
            por_pagina: 15,
            pagina_actual: 1,
            ultima_pagina: 0,
        },
        activatePregunta: null,
        message: undefined,
        errores: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadPreguntas: (state, { payload }) => {
            state.preguntas = payload;
            state.isLoading = false;
        },
        onLoadPaginacion: (state, { payload }) => {
            state.paginacion = payload;
        },
        onAddPregunta: (state, { payload }) => {
            state.preguntas.push(payload);
            state.activatePregunta = null;
        },
        onUpdatePregunta: (state, { payload }) => {
            state.preguntas = state.preguntas.map((pregunta) => {
                if (pregunta.id === payload.id) {
                    return payload;
                }
                return pregunta;
            });
            state.activatePregunta = null;
        },
        onDeletePregunta: (state) => {
            if (state.activatePregunta) {
                state.preguntas = state.preguntas.filter(
                    (pregunta) => pregunta.id !== state.activatePregunta.id
                );
                state.activatePregunta = null;
            }
        },
        onSetActivatePregunta: (state, { payload }) => {
            state.activatePregunta = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearPreguntas: (state) => {
            state.preguntas = [];
            state.activatePregunta = null;
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
    onLoadPreguntas,
    onLoadPaginacion,
    onAddPregunta,
    onUpdatePregunta,
    onDeletePregunta,
    onSetActivatePregunta,
    onClearPreguntas,
    onLoadMessage,
    onLoadErrores,
} = preguntaSlice.actions;
