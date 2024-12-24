import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    zonas: [],
    /* activateCanton: null, */
    message: undefined,
    errores: undefined,
};

export const zonaSlice = createSlice({
    name: "zona",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadZonas: (state, { payload }) => {
            state.zonas = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearZonas: (state) => {
            state.zonas = [];
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
    onLoadZonas,
    onClearZonas,
    onLoadMessage,
    onLoadErrores,
} = zonaSlice.actions;
