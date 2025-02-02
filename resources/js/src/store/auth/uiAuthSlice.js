import { createSlice } from "@reduxjs/toolkit";

export const uiAuthSlice = createSlice({
    name: "uiAuth",
    initialState: {
        isOpenModalRegisterUser: false,
    },
    reducers: {
        onOpenModalRegisterUser: (state, { payload }) => {
            state.isOpenModalRegisterUser = payload;
        },
    },
});

export const {
    onOpenModalRegisterUser
} = uiAuthSlice.actions;
