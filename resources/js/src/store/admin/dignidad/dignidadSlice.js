import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    dignidades: [],
    activateDignidad: null,
    message: undefined,
    errores: undefined,
};

export const dignidadSlice = createSlice({
    name: "dignidad",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadDignidades: (state, { payload }) => {
            state.dignidades = payload;
            state.isLoading = false;
        },
        onSetActivateDignidad: (state, { payload }) => {
            state.activateDignidad = payload;
            state.isLoading = false;
        },
        onClearDignidades: (state) => {
            state.dignidades = [];
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
    onLoadDignidades,
    onSetActivateDignidad,
    onClearDignidades,
    onLoadMessage,
    onLoadErrores,
} = dignidadSlice.actions;
