import { createSlice } from "@reduxjs/toolkit";

export const tendenciaSlice = createSlice({
    name: "tendencia",
    initialState: {
        pageLoad: false,
        isLoading: false,
        tendencias: [],
        tendenciasChart: [],
        errores: undefined,
        message: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadTendencias: (state, { payload }) => {
            state.tendencias = payload;
            state.pageLoad = true;
            state.isLoading = false;
        },
        onLoadTendenciasChart: (state, { payload }) => {
            state.tendenciasChart = payload;
        },
        onClearTendencias: (state) => {
            state.tendencias = [];
            state.tendenciasChart = [];
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
    onLoadTendencias,
    onLoadTendenciasChart,
    onClearTendencias,
    onLoadMessage,
    onLoadErrores,
} = tendenciaSlice.actions;
