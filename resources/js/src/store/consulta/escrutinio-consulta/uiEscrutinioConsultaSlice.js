import { createSlice } from "@reduxjs/toolkit";

export const uiEscrutinioConsultaSlice = createSlice({
    name: "uiEscrutinioConsulta",
    initialState: {
        isOpenModalEscrutinioParroquias: false,
        isOpenModalEscrutinioZonas: false,
        isOpenModalEscrutinioRecintos: false,
        isOpenModalEscrutinioJuntas: false,
    },
    reducers: {
        onOpenModalEscrutinioParroquias: (state, { payload }) => {
            state.isOpenModalEscrutinioParroquias = payload;
        },
        onOpenModalEscrutinioZonas: (state, { payload }) => {
            state.isOpenModalEscrutinioZonas = payload;
        },
        onOpenModalEscrutinioRecintos: (state, { payload }) => {
            state.isOpenModalEscrutinioRecintos = payload;
        },
        onOpenModalEscrutinioJuntas: (state, { payload }) => {
            state.isOpenModalEscrutinioJuntas = payload;
        },
    },
});

export const {
    onOpenModalEscrutinioParroquias,
    onOpenModalEscrutinioZonas,
    onOpenModalEscrutinioRecintos,
    onOpenModalEscrutinioJuntas,
} = uiEscrutinioConsultaSlice.actions;
