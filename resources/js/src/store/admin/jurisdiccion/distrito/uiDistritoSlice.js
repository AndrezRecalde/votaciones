import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalDistrito: false,
    isOpenModalStatusDistrito: false,
};

export const uiDistritoSlice = createSlice({
    name: "uiDistrito",
    initialState,
    reducers: {
        onOpenModalDistrito: (state, { payload }) => {
            state.isOpenModalDistrito = payload;
        },
        onOpenModalStatusDistrito: (state, { payload }) => {
            state.isOpenModalStatusDistrito = payload;
        },
    },
});

export const { onOpenModalDistrito, onOpenModalStatusDistrito } =
    uiDistritoSlice.actions;
