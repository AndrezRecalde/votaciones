import { createSlice } from "@reduxjs/toolkit";

export const uiResultadoConsultaSlice = createSlice({
    name: "uiResultadoConsulta",
    initialState: {
        isOpenModalExportPDFResultados: false,
        isOpenModalExportXLSResultados: false,
    },
    reducers: {
        onOpenModalExportPDFResultados: (state, { payload }) => {
            state.isOpenModalExportPDFResultados = payload;
        },
        onOpenModalExportXLSResultados: (state, { payload }) => {
            state.isOpenModalExportXLSResultados = payload;
        },
    },
});

export const {
    onOpenModalExportPDFResultados,
    onOpenModalExportXLSResultados,
} = uiResultadoConsultaSlice.actions;
