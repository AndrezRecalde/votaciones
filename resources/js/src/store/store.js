import { configureStore } from "@reduxjs/toolkit";
import {
    actaConsultaSlice,
    actaSlice,
    authSlice,
    candidatoSlice,
    dignidadSlice,
    distritoSlice,
    escrutinioConsultaSlice,
    escrutinioSlice,
    guessSlice,
    jurisdiccionSlice,
    organizacionSlice,
    preguntaSlice,
    resultadoConsultaSlice,
    resultadosSlice,
    roleSlice,
    storageSlice,
    tendenciaConsultaSlice,
    tendenciaSlice,
    uiCandidatoSlice,
    uiDignidadSlice,
    uiDistritoSlice,
    uiEscrutinioConsultaSlice,
    uiGuessSlice,
    uiHeaderMenuSlice,
    uiOrganizacionSlice,
    uiPreguntaSlice,
    uiResultadoConsultaSlice,
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

        pregunta: preguntaSlice.reducer,
        uiPregunta: uiPreguntaSlice.reducer,

        actaConsulta: actaConsultaSlice.reducer,

        resultadoConsulta: resultadoConsultaSlice.reducer,
        uiResultadoConsulta: uiResultadoConsultaSlice.reducer,

        escrutinioConsulta: escrutinioConsultaSlice.reducer,
        uiEscrutinioConsulta: uiEscrutinioConsultaSlice.reducer,

        tendenciaConsulta: tendenciaConsultaSlice.reducer,

        storage: storageSlice.reducer,
    },
});
