/* Auth */
import { authSlice } from "./auth/authSlice";

/* Usuario */
import { usuarioSlice } from "./admin/usuario/usuarioSlice";
import { uiUsuarioSlice } from "./admin/usuario/uiUsuarioSlice";

/* Roles */
import { roleSlice } from "./admin/role/roleSlice";

/* Organizaciones */
import { organizacionSlice } from "./admin/organizacion/organizacionSlice";
import { uiOrganizacionSlice } from "./admin/organizacion/uiOrganizacionSlice";

/* Candidatos */
import { candidatoSlice } from "./admin/candidato/candidatoSlice";
import { uiCandidatoSlice } from "./admin/candidato/uiCandidatoSlice";

/* Actas */
import { actaSlice } from "./admin/acta/actaSlice";

/* Dignidad */
import { dignidadSlice } from "./admin/dignidad/dignidadSlice";
import { uiDignidadSlice } from "./admin/dignidad/uiDignidadSlice";

/* Jurisdiccion: Provincias, Cantones, Parroquias */
import { jurisdiccionSlice } from "./admin/jurisdiccion/jurisdiccionSlice";

/* Jurisdiccion: Distrito */
import { distritoSlice } from "./admin/jurisdiccion/distrito/distritoSlice";
import { uiDistritoSlice } from "./admin/jurisdiccion/distrito/uiDistritoSlice";

/* Jurisdiccion: Zonas */
import { zonaSlice } from "./admin/jurisdiccion/zona/zonaSlice";

/* Jurisdiccion: Juntas */
import { juntaSlice } from "./admin/jurisdiccion/junta/juntaSlice";

/* Resultados */
import { resultadosSlice } from "./resultados/resultadosSlice";

/* Escrutinios */
import { escrutinioSlice } from "./admin/escrutinio/escrutinioSlice";

/* Invitados */
import { guessSlice } from "./admin/guess/guessSlice";
import { uiGuessSlice } from "./admin/guess/uiGuessSlice";

/* Tendencia */
import { tendenciaSlice } from "./admin/tendencia/tendenciaSlice";

/* Storages */
import { storageSlice } from "./storage/storageSlice";

import { store } from "./store";

export {
    /* Auth */
    authSlice,

    /* Usuarios */
    usuarioSlice,
    uiUsuarioSlice,

    /* Roles */
    roleSlice,

    /* Organizaciones */
    organizacionSlice,
    uiOrganizacionSlice,

    /* Candidatos */
    candidatoSlice,
    uiCandidatoSlice,

    /* Acta */
    actaSlice,

    /* Dignidad */
    dignidadSlice,
    uiDignidadSlice,

    /* Jurisdiccion: Provincias, Cantones, Parroquias */
    jurisdiccionSlice,

    /* Jurisdiccion: Distrito */
    distritoSlice,
    uiDistritoSlice,

    /* Jurisdiccion: Zonas */
    zonaSlice,

    /* Jurisdiccion: Juntas */
    juntaSlice,

    /* Resultados */
    resultadosSlice,

    /* Escrutinios */
    escrutinioSlice,

    /* Invitados */
    guessSlice,
    uiGuessSlice,

    /* Tendencia */
    tendenciaSlice,

    /* Storage */
    storageSlice,


    store,
};
