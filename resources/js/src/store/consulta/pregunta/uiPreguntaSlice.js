import { createSlice } from "@reduxjs/toolkit";

export const uiPreguntaSlice = createSlice({
    name: "uiPregunta",
    initialState: {
        isOpenModalPregunta: false,
        isOpenModalStatusPregunta: false,
    },
    reducers: {
        onOpenModalPregunta: (state, { payload }) => {
            state.isOpenModalPregunta = payload;
        },
        onOpenModalStatusPregunta: (state, { payload }) => {
            state.isOpenModalStatusPregunta = payload;
        },
    },
});

export const { onOpenModalPregunta, onOpenModalStatusPregunta } =
    uiPreguntaSlice.actions;
