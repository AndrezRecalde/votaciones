import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageLoad: false,
    isLoading: false,
    disabledSearch: false,
    existeActa: false,
    actas: [],
    activateJunta: null,
    activateActa: null,
    activateCandidatos: null,
    message: undefined,
    errores: undefined,
};

export const actaSlice = createSlice({
    name: "acta",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onActiveSearch: (state, { payload }) => {
            state.disabledSearch = payload;
        },
        onLoadActas: (state, { payload }) => {
            state.actas = payload;
            state.pageLoad = true;
            state.isLoading = false;
        },
        onActivateJunta: (state, { payload }) => {
            state.activateJunta = payload;
            state.pageLoad = true;
        },
        onActivateActa: (state, { payload }) => {
            state.activateActa = payload;
            state.existeActa = true;
            state.isLoading = false;
        },
        onActivateCandidatos: (state, { payload }) => {
            state.activateCandidatos = payload;
        },
        onClearActa: (state) => {
            state.pageLoad = false;
            state.disabledSearch = false;
            state.existeActa = false;
            state.activateJunta = null;
            state.activateActa = null;
            state.activateCandidatos = null;
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
    onLoadActas,
    onActivateJunta,
    onActivateActa,
    onActivateCandidatos,
    onClearActa,
    onLoadMessage,
    onLoadErrores,
} = actaSlice.actions;
