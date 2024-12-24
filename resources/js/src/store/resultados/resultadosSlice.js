import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageLoad: false,
    isLoading: false,
    totalDeVotos: 0,
    totalActasIngresadas: 0,
    totalJuntas: 0,
    resultadoCandidatos: [],
    resultadosForMap: [],
    message: undefined,
    errores: undefined,
};

export const resultadosSlice = createSlice({
    name: "resultados",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadTotalDeVotos: (state, { payload }) => {
            state.totalDeVotos = payload;
        },
        onLoadTotalIngresadas: (state, { payload }) => {
            state.totalActasIngresadas = payload;
        },
        onLoadTotalJuntas: (state, { payload }) => {
            state.totalJuntas = payload;
        },
        onLoadResultadosCandidatos: (state, { payload }) => {
            state.resultadoCandidatos = payload;
            state.pageLoad = true;
            state.isLoading = false;
        },
        onLoadResultadosForMap: (state, { payload }) => {
            state.resultadosForMap = payload;
        },
        onClearResultados: (state) => {
            state.totalDeVotos = 0;
            state.totalActasIngresadas = 0;
            state.totalJuntas = 0;
            state.resultadoCandidatos = [];
            state.resultadosForMap = [];
            state.isLoading = false;
            state.pageLoad = false;
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
    onLoadTotalDeVotos,
    onLoadTotalIngresadas,
    onLoadTotalJuntas,
    onLoadResultadosCandidatos,
    onLoadResultadosForMap,
    onClearResultados,
    onLoadMessage,
    onLoadErrores,
} = resultadosSlice.actions;
