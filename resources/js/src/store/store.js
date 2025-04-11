import { configureStore } from "@reduxjs/toolkit";
import {
    actaSlice,
    authSlice,
    candidatoSlice,
    dignidadSlice,
    distritoSlice,
    escrutinioSlice,
    guessSlice,
    jurisdiccionSlice,
    organizacionSlice,
    resultadosSlice,
    roleSlice,
    storageSlice,
    tendenciaSlice,
    uiCandidatoSlice,
    uiDignidadSlice,
    uiDistritoSlice,
    uiGuessSlice,
    uiHeaderMenuSlice,
    uiOrganizacionSlice,
    uiResultadosSlice,
    uiUsuarioSlice,
    usuarioSlice,
} from "../store";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,

        uiHeaderMenu: uiHeaderMenuSlice.reducer,

        usuario: usuarioSlice.reducer,
        uiUsuario: uiUsuarioSlice.reducer,

        guess: guessSlice.reducer,
        uiGuess: uiGuessSlice.reducer,

        role: roleSlice.reducer,

        jurisdiccion: jurisdiccionSlice.reducer,

        dignidad: dignidadSlice.reducer,
        uiDignidad: uiDignidadSlice.reducer,

        acta: actaSlice.reducer,

        candidato: candidatoSlice.reducer,
        uiCandidato: uiCandidatoSlice.reducer,

        distrito: distritoSlice.reducer,
        uiDistrito: uiDistritoSlice.reducer,

        organizacion: organizacionSlice.reducer,
        uiOrganizacion: uiOrganizacionSlice.reducer,

        acta: actaSlice.reducer,

        resultados: resultadosSlice.reducer,
        uiResultados: uiResultadosSlice.reducer,

        escrutinio: escrutinioSlice.reducer,

        tendencia: tendenciaSlice.reducer,

        storage: storageSlice.reducer,
    },
});
