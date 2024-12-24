import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    organizaciones: [],
    activateOrganizacion: null,
    message: undefined,
    errores: undefined,
};

export const organizacionSlice = createSlice({
    name: "organizacion",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadOrganizaciones: (state, { payload }) => {
            state.organizaciones = payload;
            state.isLoading = false;
        },
        onAddOrganizacion: (state, { payload }) => {
            state.organizaciones.push(payload);
            state.activateOrganizacion = null;
        },
        onUpdateOrganizacion: (state, { payload }) => {
            state.organizaciones = state.organizaciones.map((organizacion) => {
                if (organizacion.id === payload.id) {
                    return payload;
                }
                return organizacion;
            });
            state.activateOrganizacion = null;
        },
        onDeleteOrganizacion: (state) => {
            if (state.activateOrganizacion) {
                state.organizaciones = state.organizaciones.filter(
                    (organizacion) =>
                        organizacion.id !== state.activateOrganizacion.id
                );
                state.activateOrganizacion = null;
            }
        },
        onSetActivateOrganizacion: (state, { payload }) => {
            state.activateOrganizacion = payload;
            state.isLoading = false;
        },
        onClearOrganizaciones: (state) => {
            state.organizaciones = [];
            state.activateOrganizacion = null;
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
    onLoadOrganizaciones,
    onAddOrganizacion,
    onUpdateOrganizacion,
    onDeleteOrganizacion,
    onSetActivateOrganizacion,
    onClearOrganizaciones,
    onLoadMessage,
    onLoadErrores,
} = organizacionSlice.actions;
