import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    juntas: [],
    /* activateCanton: null, */
    message: undefined,
    errores: undefined,
};

export const juntaSlice = createSlice({
    name: "junta",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadJuntas: (state, { payload }) => {
            state.juntas = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearJuntas: (state) => {
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
    onLoadJuntas,
    onClearJuntas,
    onLoadMessage,
    onLoadErrores,
} = juntaSlice.actions;
