import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageLoad: false,
    isLoading: false,
    isSendingWhats: false,
    isExport: false,
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
        onSending: (state, { payload }) => {
            state.isSendingWhats = payload;
        },
        onExport: (state, { payload }) => {
            state.isExport = payload;
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
            state.isLoading = false;
        },
        onClearResultadosMap: (state) => {
            state.resultadosForMap = [];
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
    onSending,
    onExport,
    onLoadTotalDeVotos,
    onLoadTotalIngresadas,
    onLoadTotalJuntas,
    onLoadResultadosCandidatos,
    onLoadResultadosForMap,
    onClearResultadosMap,
    onClearResultados,
    onLoadMessage,
    onLoadErrores,
} = resultadosSlice.actions;
