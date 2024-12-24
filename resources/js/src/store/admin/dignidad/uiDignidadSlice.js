import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalStatusDignidad: false,
}

export const uiDignidadSlice = createSlice({
    name: "uiDignidad",
    initialState,
    reducers: {
        onOpenModalStatusDignidad: (state, { payload }) => {
            state.isOpenModalStatusDignidad = payload;
        },
    },
});

export const { onOpenModalStatusDignidad } = uiDignidadSlice.actions;
