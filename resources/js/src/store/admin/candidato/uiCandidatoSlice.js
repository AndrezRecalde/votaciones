import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalCandidato: false,
    isOpenModalStatusCandidato: false,
};

export const uiCandidatoSlice = createSlice({
    name: "uiCandidato",
    initialState,
    reducers: {
        onOpenModalCandidato: (state, { payload }) => {
            state.isOpenModalCandidato = payload;
        },
        onOpenModalStatusCandidato: (state, { payload }) => {
            state.isOpenModalStatusCandidato = payload;
        },
    },
});

export const { onOpenModalCandidato, onOpenModalStatusCandidato } =
    uiCandidatoSlice.actions;
