import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    provincias: [],
    cantones: [],
    parroquias: [],
    recintos: [],
    zonas: [],
    juntas: [],
    /* activateCanton: null, */
    message: undefined,
    errores: undefined,
};

export const jurisdiccionSlice = createSlice({
    name: "jurisdiccion",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadProvincias: (state, { payload }) => {
            state.provincias = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onLoadCantones: (state, { payload }) => {
            state.cantones = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onLoadParroquias: (state, { payload }) => {
            state.parroquias = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onLoadRecintos: (state, { payload }) => {
            state.recintos = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onLoadZonas: (state, { payload }) => {
            state.zonas = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onLoadJuntas: (state, { payload }) => {
            state.juntas = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearJurisdicciones: (state) => {
            state.cantones = [];
            state.parroquias = [];
            state.recintos = [];
            state.zonas = [];
            state.juntas = [];
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
    onLoadProvincias,
    onLoadCantones,
    onLoadParroquias,
    onLoadRecintos,
    onLoadZonas,
    onLoadJuntas,
    onClearJurisdicciones,
    onLoadMessage,
    onLoadErrores,
} = jurisdiccionSlice.actions;
