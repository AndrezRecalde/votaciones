import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    usuarios: [],
    activateUsuario: null,
    message: undefined,
    errores: undefined,
};

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        onLoading: (state) => {
            state.isLoading = true;
            state.errores = undefined;
        },
        onLoadUsuarios: (state, { payload }) => {
            state.usuarios = payload;
            state.errores = undefined;
            state.isLoading = false;
        },
        onAddUsuario: (state, { payload }) => {
            state.usuarios.push(payload);
            state.activateUsuario = null;
            state.errores = undefined;
        },
        onUpdateUsuario: (state, { payload }) => {
            state.usuarios = state.usuarios.map((usuario) => {
                if (usuario.id === payload.id) {
                    return payload;
                }
                return usuario;
            });
            state.activateUsuario = null;
            state.errores = undefined;
        },
        onDeleteUsuario: (state) => {
            if (state.activateUsuario) {
                state.usuarios = state.usuarios.filter(
                    (usuario) => usuario.id !== state.activateUsuario.id
                );
                state.activateUsuario = null;
                state.errores = undefined;
            }
        },
        onSetActivateUsuario: (state, { payload }) => {
            state.activateUsuario = payload;
            state.errores = undefined;
            state.isLoading = false;
        },
        onClearUsuarios: (state) => {
            state.usuarios = [];
            state.activateUsuario = null;
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
    onLoadUsuarios,
    onAddUsuario,
    onUpdateUsuario,
    onDeleteUsuario,
    onSetActivateUsuario,
    onClearUsuarios,
    onLoadMessage,
    onLoadErrores,
} = usuarioSlice.actions;
