import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    candidatos: [],
    activateCandidato: null,
    message: undefined,
    errores: undefined,
};

export const candidatoSlice = createSlice({
    name: "candidato",
    initialState,
    reducers: {
        onLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        onLoadCandidatos: (state, { payload }) => {
            state.candidatos = payload;
            state.isLoading = false;
        },
        onAddCandidato: (state, { payload }) => {
            state.candidatos.push(payload);
            state.activateCandidato = null;
        },
        onUpdateCandidato: (state, { payload }) => {
            state.candidatos = state.candidatos.map((candidato) => {
                if (candidato.id === payload.id) {
                    return payload;
                }
                return candidato;
            });
            state.activateCandidato = null;
        },
        onDeleteCandidato: (state) => {
            if (state.activateCandidato) {
                state.candidatos = state.candidatos.filter(
                    (candidato) => candidato.id !== state.activateCandidato.id
                );
                state.activateCandidato = null;
            }
        },
        onSetActivateCandidato: (state, { payload }) => {
            state.activateCandidato = payload;
            state.isLoading = false;
            state.errores = undefined;
        },
        onClearCandidatos: (state) => {
            state.candidatos = [];
            state.activateCandidato = null;
            state.errores = undefined;
        },
        onLoadMessage: (state, { payload }) => {
            state.message = payload;
        },
        onLoadErrores: (state, { payload }) => {
            state.errores = payload;
        },
    },
});

export const {
    onLoading,
    onLoadCandidatos,
    onAddCandidato,
    onUpdateCandidato,
    onDeleteCandidato,
    onSetActivateCandidato,
    onClearCandidatos,
    onLoadMessage,
    onLoadErrores,
} = candidatoSlice.actions;
