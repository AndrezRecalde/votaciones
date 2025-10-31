import { createSlice } from "@reduxjs/toolkit";

export const uiHeaderMenuSlice = createSlice({
    name: "uiHeaderMenu",
    initialState: {
        isOpenDrawerMobile: false,
        isOpenMenuLinksAdmin: false,
        isOpenMenuLinksResultados: false,
    },
    reducers: {
        onOpenDrawerMobile: (state, { payload }) => {
            state.isOpenDrawerMobile = payload;
        },
        onOpenMenuLinksAdmin: (state, { payload }) => {
            state.isOpenMenuLinksAdmin = payload;
        },
        onOpenMenuLinksResultados: (state, { payload }) => {
            state.isOpenMenuLinksResultados = payload;
        },
    },
});

export const {
    onOpenDrawerMobile,
    onOpenMenuLinksAdmin,
    onOpenMenuLinksResultados,
} = uiHeaderMenuSlice.actions;
