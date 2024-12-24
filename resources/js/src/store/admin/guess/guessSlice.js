import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    guesses: [],
    activateGuess: null,
    message: undefined,
    errores: undefined,
};

export const guessSlice = createSlice({
    name: "guess",
    initialState,
    reducers: {
        onLoading: (state) => {
            state.isLoading = true;
            state.errores = undefined;
        },
        onLoadGuesses: (state, { payload }) => {
            state.guesses = payload;
            state.errores = undefined;
            state.isLoading = false;
        },
        onAddGuess: (state, { payload }) => {
            state.guesses.push(payload);
            state.activateGuess = null;
            state.errores = undefined;
        },
        onUpdateGuess: (state, { payload }) => {
            state.guesses = state.guesses.map((invitado) => {
                if (invitado.id === payload.id) {
                    return payload;
                }
                return invitado;
            });
            state.activateGuess = null;
            state.errores = undefined;
        },
        onDeleteGuess: (state) => {
            if (state.activateGuess) {
                state.guesses = state.guesses.filter(
                    (invitado) => invitado.id !== state.activateGuess.id
                );
                state.activateGuess = null;
                state.errores = undefined;
            }
        },
        onSetActivateGuess: (state, { payload }) => {
            state.activateGuess = payload;
            state.errores = undefined;
            state.isLoading = false;
        },
        onClearGuesses: (state) => {
            state.guesses = [];
            state.activateGuess = null;
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
    onLoadGuesses,
    onAddGuess,
    onUpdateGuess,
    onDeleteGuess,
    onSetActivateGuess,
    onClearGuesses,
    onLoadMessage,
    onLoadErrores,
} = guessSlice.actions;
