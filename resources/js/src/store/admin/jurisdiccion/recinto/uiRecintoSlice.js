import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalNumJuntas: false,
};

export const uiRecintoSlice = createSlice({
    name: "uiRecinto",
    initialState,
    reducers: {
        onOpenModalNumJuntas: (state, { payload }) => {
            state.isOpenModalNumJuntas = payload;
        },
    },
});

export const { onOpenModalNumJuntas } = uiRecintoSlice.actions;
