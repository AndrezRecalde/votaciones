/* Title Pages */
import { useTitleHook } from "./title/useTitleHook";

/* Authentication */
import { useAuthStore } from "./auth/useAuthStore";
import { useUiAuth } from "./auth/useUiAuth";

/* Usuario */
import { useUsuarioStore } from "./usuario/useUsuarioStore";
import { useUiUsuario } from "./usuario/useUiUsuario";

/* Invitados */
import { useGuessStore } from "./guess/useGuessStore";
import { useUiGuess } from "./guess/useUiGuess";


/* Candidato */
import { useCandidatoStore } from "./candidato/useCandidatoStore";
import { useUiCandidato } from "./candidato/useUiCandidato";

/* Organizacion */
import { useOrganizacionStore } from "./organizacion/useOrganizacionStore";
import { useUiOrganizacion } from "./organizacion/useUiOrganizacion";

/* Dignidades */
import { useDignidadStore } from "./dignidad/useDignidadStore";
import { useUiDignidad } from "./dignidad/useUiDignidad";

/* Distritos */
import { useDistritoStore } from "./distrito/useDistritoStore";
import { useUiDistrito } from "./distrito/useUiDistrito";

/* Role */
import { useRoleStore } from "./roles/useRoleStore";

/* Jurisdiccion */
import { useJurisdiccionStore } from "./jurisdiccion/useJurisdiccionStore";

/* Actas */
import { useActaStore } from "./acta/useActaStore";

/* Resultados */
import { useResultadoStore } from "./resultado/useResultadoStore";
import { useUiResultado } from "./resultado/useUiResultado";

/* Escrutinio */
import { useEscrutinioStore } from "./escrutinio/useEscrutinioStore";

/* Tendencias */
import { useTendenciaStore } from "./tendencia/useTendenciaStore";
import { transformTendencias } from "./tendencia/transformTendencias";

/* Storages */
import { useStorageStore } from "./storage/useStorageStore";

/* Fecha */
import { useFechaStore } from "./fecha/useFechaStore";

/* Error */
import { useErrorException } from "./error/useErrorException";


export {
    /* Title */
    useTitleHook,

    /* Authentication */
    useAuthStore,
    useUiAuth,

    /* Usuario */
    useUsuarioStore,
    useUiUsuario,

    /* Invitados */
    useGuessStore,
    useUiGuess,

    /* Candidato */
    useCandidatoStore,
    useUiCandidato,

    /* Organizacion */
    useOrganizacionStore,
    useUiOrganizacion,

    /* Dignidades */
    useDignidadStore,
    useUiDignidad,

    /* Distrito */
    useDistritoStore,
    useUiDistrito,

    /* Role */
    useRoleStore,

    /* Jurisdiccion */
    useJurisdiccionStore,

    /* Actas */
    useActaStore,

    /* Resultados */
    useResultadoStore,
    useUiResultado,

    /* Escrutinio */
    useEscrutinioStore,

    /* Tendencias */
    useTendenciaStore,
    transformTendencias,

    /* Fecha */
    useFechaStore,

    /* Storages */
    useStorageStore,

    /* Error */
    useErrorException
}
