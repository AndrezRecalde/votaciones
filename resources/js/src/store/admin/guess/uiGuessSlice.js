import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalGuess: false,
    isOpenModalStatusGuess: false
};

export const uiGuessSlice = createSlice({
    name: "uiGuess",
    initialState,
    reducers: {
        onOpenModalGuess: (state, { payload }) => {
            state.isOpenModalGuess = payload;
        },
        onOpenModalStatusGuess: (state, { payload }) => {
            state.isOpenModalStatusGuess = payload;
        }
    },
});

export const {
    onOpenModalGuess,
    onOpenModalStatusGuess
} = uiGuessSlice.actions;
