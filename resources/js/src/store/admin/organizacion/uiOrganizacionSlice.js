import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenModalOrganizacion: false,
}

export const uiOrganizacionSlice = createSlice({
    name: "uiOrganizacion",
    initialState,
    reducers: {
        onOpenModalAddOrganizacion: (state, { payload }) => {
            state.isOpenModalOrganizacion = payload;
        },
    },
});

export const { onOpenModalAddOrganizacion } = uiOrganizacionSlice.actions;
