import { createSlice } from "@reduxjs/toolkit";

export const uiHeaderMenuSlice = createSlice({
    name: "uiHeaderMenu",
    initialState: {
        isOpenDrawerMobile: false,
        isOpenMenuLinksTics: false,
    },
    reducers: {
        onOpenDrawerMobile: (state, { payload }) => {
            state.isOpenDrawerMobile = payload;
        },
        onOpenMenuLinksTics: (state, { payload }) => {
            state.isOpenMenuLinksTics = payload;
        },
    },
});

export const { onOpenDrawerMobile, onOpenMenuLinksTics } =
    uiHeaderMenuSlice.actions;
