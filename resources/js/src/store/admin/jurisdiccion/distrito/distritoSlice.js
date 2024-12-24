import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    distritos: [],
    activateDistrito: null,
    message: undefined,
    errores: undefined,
};

export const distritoSlice = createSlice({
    name: "distrito",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadDistritos: (state, { payload }) => {
            state.distritos = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onAddDistrito: (state, { payload }) => {
            state.distritos.push(payload);
            state.activateDistrito = null;
        },
        onUpdateDistrito: (state, { payload }) => {
            state.distritos = state.distritos.map((distrito) => {
                if (distrito.id === payload.id) {
                    return payload;
                }
                return distrito;
            });
            state.activateDistrito = null;
        },
        onDeleteDistrito: (state) => {
            if (state.activateDistrito) {
                state.distritos = state.distritos.filter(
                    (distrito) => distrito.id !== state.activateDistrito.id
                );
                state.activateDistrito = null;
            }
        },
        onSetActivateDistrito: (state, { payload }) => {
            state.activateDistrito = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearDistritos: (state) => {
            state.distritos = [];
            state.activateDistrito = null;
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
    onLoadDistritos,
    onAddDistrito,
    onUpdateDistrito,
    onDeleteDistrito,
    onSetActivateDistrito,
    onClearDistritos,
    onLoadMessage,
    onLoadErrores,
} = distritoSlice.actions;
