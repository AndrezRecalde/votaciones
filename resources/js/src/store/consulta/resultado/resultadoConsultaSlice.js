import { createSlice } from "@reduxjs/toolkit";

export const resultadoConsultaSlice = createSlice({
    name: "resultadoConsulta",
    initialState: {
        loading: false,
        loadingResultados: false,
        numero_electores: {
            total_electores: 0,
        },
        totales: {
            total_votos_blancos: 0,
            total_votos_nulos: 0,
            total_votos_validos: 0,
        },
        resultados: [],
        filtrosAplicados: {},
        message: undefined,
        errores: undefined,
    },
    reducers: {
        onLoading: (state, { payload }) => {
            state.loading = payload;
        },
        onLoadNumeroElectores: (state, { payload }) => {
            state.numero_electores = payload;
        },
        onLoadTotales: (state, { payload }) => {
            state.totales = payload;
        },
        onLoadResultados: (state, { payload }) => {
            state.resultados = payload;
            state.loadingResultados = true;
            state.loading = false;
        },
        onSetFiltrosAplicados: (state, { payload }) => {
            state.filtrosAplicados = payload;
        },
        onClearResultadoConsulta: (state) => {
            state.loading = false;
            state.loadingResultados = false;
            state.numero_electores = {
                total_electores: 0,
            };
            state.totales = {
                total_votos_blancos: 0,
                total_votos_nulos: 0,
                total_votos_validos: 0,
            };
            state.resultados = [];
            state.filtrosAplicados = {};
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
    onLoadNumeroElectores,
    onLoadTotales,
    onLoadResultados,
    onSetFiltrosAplicados,
    onClearResultadoConsulta,
    onLoadMessage,
    onLoadErrores,
} = resultadoConsultaSlice.actions;
