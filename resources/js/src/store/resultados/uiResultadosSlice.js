import { createSlice } from "@reduxjs/toolkit";

export const uiResultadosSlice = createSlice({
    name: "uiResultados",
    initialState: {
        isOpenModalWhatsApp: false,
        isOpenModalResultados: false,
        isOpenModalResultadosXLS: false,
    },
    reducers: {
        onOpenModalWhatsApp: (state, { payload }) => {
            state.isOpenModalWhatsApp = payload;
        },
        onOpenModalResultados: (state, { payload }) => {
            state.isOpenModalResultados = payload;
        },
        onOpenModalResultadosXLS: (state, { payload }) => {
            state.isOpenModalResultadosXLS = payload;
        },
    },
});

export const {
    onOpenModalWhatsApp,
    onOpenModalResultados,
    onOpenModalResultadosXLS,
} = uiResultadosSlice.actions;
