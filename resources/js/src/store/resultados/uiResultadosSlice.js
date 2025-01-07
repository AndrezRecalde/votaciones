import { createSlice } from "@reduxjs/toolkit";

export const uiResultadosSlice = createSlice({
    name: "uiResultados",
    initialState: {
        isOpenModalWhatsApp: false,
        isOpenModalResultados: false,
    },
    reducers: {
        onOpenModalWhatsApp: (state, { payload }) => {
            state.isOpenModalWhatsApp = payload;
        },
        onOpenModalResultados: (state, { payload }) => {
            state.isOpenModalResultados = payload;
        }
    },
});

export const { onOpenModalWhatsApp, onOpenModalResultados } = uiResultadosSlice.actions;
