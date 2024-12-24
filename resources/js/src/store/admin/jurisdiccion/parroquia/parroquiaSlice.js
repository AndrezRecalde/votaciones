import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    parroquias: [],
    /* activateCanton: null, */
    message: undefined,
    errores: undefined,
};

export const parroquiaSlice = createSlice({
    name: "parroquia",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadParroquias: (state, { payload }) => {
            state.parroquias = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearParroquias: (state) => {
            state.parroquias = [];
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
    onLoadParroquias,
    onClearParroquias,
    onLoadMessage,
    onLoadErrores,
} = parroquiaSlice.actions;
