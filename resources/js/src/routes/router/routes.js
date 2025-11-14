import { lazy } from "react";
import {
    IconLogout,
    IconQuestionMark,
    IconSettings,
    //IconSitemap,
    IconUserHexagon,
    IconUserPlus,
    //IconUserScan,
    //IconUserStar,
} from "@tabler/icons-react";

const AuthPage = lazy(() =>
    import(/* webpackChunkName: "AuthPage" */ "../../pages/auth/AuthPage")
);
const ChangePwdPage = lazy(() =>
    import(
        /* webpackChunkName: "ChangePwdPage" */ "../../pages/user/ChangePwdPage"
    )
);

const UsuariosPage = lazy(() =>
    import(
        /* webpackChunkName: "UsuariosPage" */ "../../pages/user/UsuariosPage"
    )
);
const GuessesPage = lazy(() =>
    import(
        /* webpackChunkName: "UsuariosPage" */ "../../pages/admin/guesses/GuessesPage"
    )
);
const CandidatosPage = lazy(() =>
    import(
        /* webpackChunkName: "CandidatosPage" */ "../../pages/admin/candidato/CandidatosPage"
    )
);
const OrganizacionesPage = lazy(() =>
    import(
        /* webpackChunkName: "OrganizacionesPage" */ "../../pages/admin/organizaciones/OrganizacionesPage"
    )
);

const ResultadosBinomiosPage = lazy(() =>
    import(
        /* webpackChunkName: "ResultadosBinomiosPage" */ "../../pages/resultados/ResultadosBinomiosPage"
    )
);
const ResultadosWebsterPage = lazy(() =>
    import(
        /* webpackChunkName: "ResultadosWebsterPage" */ "../../pages/resultados/ResultadosWebsterPage"
    )
);

const TendenciaPage = lazy(() =>
    import(
        /* webpackChunkName: "TendenciaPage" */ "../../pages/tendencia/TendenciaPage"
    )
);

const EscrutinioPage = lazy(() =>
    import(
        /* webpackChunkName: "EscrutinioPage" */ "../../pages/escrutinio/EscrutinioPage"
    )
);

const BusquedaActaPage = lazy(() =>
    import(
        /* webpackChunkName: "BusquedaActaPage" */ "../../pages/acta/BusquedaActaPage"
    )
);

const GuessesResultadosPage = lazy(() =>
    import(
        /* webpackChunkName: "GuessResultadosPage" */ "../../pages/guess/GuessResultadosPage"
    )
);

const ProfilePage = lazy(() =>
    import(/* webpackChunkName: "ProfilePage" */ "../../pages/user/ProfilePage")
);

const DigitacionPage = lazy(() =>
    import(
        /* webpackChunkName: "DigitacionPage" */ "../../pages/digitacion/DigitacionPage"
    )
);

/* Consulta Popular */
/* Digitacion Consulta Popular */
const DigitacionConsultaPage = lazy(() =>
    import(
        /* webpackChunkName: "DigitacionConsultaPage" */ "../../pages/consulta-popular/digitacion/DigitacionConsultaPage"
    )
);

/* Preguntas Consulta Popular */
const PreguntasConsultaPage = lazy(() =>
    import(
        /* webpackChunkName: "PreguntasConsultaPage" */ "../../pages/consulta-popular/pregunta/PreguntasConsultaPage"
    )
);

/* Resultados Consulta Popular */
const ResultadosConsultaPage = lazy(() =>
    import(
        /* webpackChunkName: "ResultadosConsultaPage" */ "../../pages/consulta-popular/resultados/ResultadosConsultaPage"
    )
);

/* Escrutinio Consulta Popular */
const EscrutinioConsultaPage = lazy(() =>
    import(
        /* webpackChunkName: "EscrutinioConsultaPage" */ "../../pages/consulta-popular/escrutinio/EscrutinioConsultaPage"
    )
);

/* Seguimiento de Juntas Consulta Popular */
const SeguimientoConsultaJuntasPage = lazy(() =>
    import(
        /* webpackChunkName: "SeguimientoConsultaJuntasPage" */ "../../pages/consulta-popular/seguimiento/SeguimientoConsultaJuntasPage"
    )
);

const BusquedaActasConsultaPage = lazy(() =>
    import(
        /* webpackChunkName: "BusquedaActasConsultaPage" */ "../../pages/consulta-popular/actas-consulta/BusquedaActasConsultaPage"
    )
);

const ReporteJuntasProvinciaPage = lazy(() =>
    import(
        /* webpackChunkName: "ReporteJuntasProvinciaPage" */ "../../pages/consulta-popular/escrutinio/ReporteJuntasProvinciaPage"
    )
);

const ErrorNotFound = lazy(() =>
    import(
        /* webpackChunkName: "ErrorNotFound" */ "../../pages/error/ErrorNotFound"
    )
);

const generateRoutes = (basePath, components, roles) =>
    components.map(({ path, Component }) => ({
        path: `${path}`,
        link: `${basePath}${path}`,
        Component,
        roles,
    }));

export const PREFIX_ROUTES = {
    AUTH_ROUTES: "/auth/login",
    ADMIN: "/admin",
    ELECCIONES: "/elecciones",
    DIGITACION: "/digitacion",

    ELECCIONES_BINOMIOS: "/elecciones/binomios",
    ELECCIONES_CONSULTA: "/elecciones/consulta",
    ELECCIONES_DIGITACION: "/elecciones/digitacion",
};

export const authRoutes = {
    path: "auth/login/*",
    link: "auth/login",
    Component: AuthPage,
};

export const GENERAL_ROUTES = {
    PERFIL: "perfil",
    CAMBIAR_CONTRASENA: "cambiar-contrasena",
};

export const HEADER_MENU = {
    USUARIOS: "usuarios",
    ORGANIZACIONES: "organizaciones",
    CANDIDATOS: "candidatos",
    INVITADOS: "invitados",

    DIGITACION: "digitacion",
    RESULTADO_BINOMIOS: "resultados",
    RESULTADO_WEBSTER: "webster-resultados",
    ESCRUTINIO: "escrutinio",
    TENDENCIA: "tendencia",
    ACTAS: "actas",
    RESULTADOS_ELECCIONES_MAP: "resultados-elecciones",
};

/* Consulta Popular */
export const HEADER_MENU_CONSULTA = {
    PREGUNTAS_CONSULTA: "preguntas",
    DIGITACION_CONSULTA: "consulta",
    RESULTADO_CONSULTA: "resultados",
    ESCRUTINIO_CONSULTA: "escrutinio",
    SEGUIMIENTO_JUNTAS_CONSULTA: "seguimiento",
    ACTAS_CONSULTA: "revisar-actas",
    REPORTE_JUNTAS_CONSULTA: "reporte-juntas",
};

export const guessRoutes = {
    path: HEADER_MENU.RESULTADOS_ELECCIONES_MAP,
    link: HEADER_MENU.RESULTADOS_ELECCIONES_MAP,
    Component: GuessesResultadosPage,
};

const adminRoutes = generateRoutes(
    "admin/elecciones",
    [
        {
            path: HEADER_MENU.USUARIOS,
            Component: UsuariosPage,
        },
        {
            path: HEADER_MENU.CANDIDATOS,
            Component: CandidatosPage,
        },
        {
            path: HEADER_MENU.ORGANIZACIONES,
            Component: OrganizacionesPage,
        },
        {
            path: HEADER_MENU.INVITADOS,
            Component: GuessesPage,
        },
    ],
    ["ADMIN", "RESPONSABLE"]
);

const adminBinomiosRoutes = generateRoutes(
    "elecciones/binomios",
    [
        // Rutas de Elecciones Binomios y Webster
        {
            path: HEADER_MENU.ESCRUTINIO,
            Component: EscrutinioPage,
        },
        {
            path: HEADER_MENU.RESULTADO_BINOMIOS,
            Component: ResultadosBinomiosPage,
        },
        {
            path: HEADER_MENU.RESULTADO_WEBSTER,
            Component: ResultadosWebsterPage,
        },
        {
            path: HEADER_MENU.TENDENCIA,
            Component: TendenciaPage,
        },
        {
            path: HEADER_MENU.ACTAS,
            Component: BusquedaActaPage,
        },
    ],
    ["ADMIN", "RESPONSABLE"]
);

const adminConsultaRoutes = generateRoutes(
    "elecciones/consulta",
    [
        // Rutas para Consulta Popular
        {
            path: HEADER_MENU_CONSULTA.PREGUNTAS_CONSULTA,
            Component: PreguntasConsultaPage,
        },
        {
            path: HEADER_MENU_CONSULTA.RESULTADO_CONSULTA,
            Component: ResultadosConsultaPage,
        },
        {
            path: HEADER_MENU_CONSULTA.ESCRUTINIO_CONSULTA,
            Component: EscrutinioConsultaPage,
        },
        {
            path: HEADER_MENU_CONSULTA.SEGUIMIENTO_JUNTAS_CONSULTA,
            Component: SeguimientoConsultaJuntasPage,
        },
    ],
    ["ADMIN", "RESPONSABLE"]
);

const digitadorRoutes = generateRoutes(
    "elecciones/digitacion",
    [
        // Digitacion de acta para Binomios y Webster
        { path: "actas", Component: DigitacionPage },

        // Digitacion de acta para Consulta Popular
        { path: "consulta", Component: DigitacionConsultaPage },

        /* Revisar Actas - Consulta Popular */
        {
            path: HEADER_MENU_CONSULTA.ACTAS_CONSULTA,
            Component: BusquedaActasConsultaPage,
        },
        {
            path: HEADER_MENU_CONSULTA.REPORTE_JUNTAS_CONSULTA,
            Component: ReporteJuntasProvinciaPage,
        },
    ],
    ["ADMIN", "DIGITADOR", "RESPONSABLE"]
);

const peerRoutes = generateRoutes(
    "elecciones",
    [
        {
            path: GENERAL_ROUTES.PERFIL,
            Component: ProfilePage,
        },
        {
            path: GENERAL_ROUTES.CAMBIAR_CONTRASENA,
            Component: ChangePwdPage,
        },
    ],
    [""]
);

export const routes = {
    //auth: authRoutes,
    admin: adminRoutes,
    digitador: digitadorRoutes,
    adminBinomios: adminBinomiosRoutes,
    adminConsulta: adminConsultaRoutes,
};

export const peerLinks = {
    peer: peerRoutes,
};

export const errorRoutes = [
    {
        path: "*",
        Component: ErrorNotFound,
    },
];

export const menuRoutes = [
    /* Menu Header */

    {
        label: "Ver Perfil",
        path: "perfil",
        link: `${PREFIX_ROUTES.ELECCIONES}/${GENERAL_ROUTES.PERFIL}`,
        icon: IconUserHexagon,
        color: "#12b561",
        role: "",
    },
    {
        label: "Cambiar contraseña",
        path: "cambiar-contrasena",
        link: `${PREFIX_ROUTES.ELECCIONES}/${GENERAL_ROUTES.CAMBIAR_CONTRASENA}`,
        icon: IconSettings,
        color: "#6d7c85",
        role: "",
    },
    {
        label: "Usuarios",
        path: "usuarios",
        link: `${PREFIX_ROUTES.ADMIN}${PREFIX_ROUTES.ELECCIONES}/${HEADER_MENU.USUARIOS}`,
        icon: IconUserPlus,
        color: "#1250fc",
        role: "ADMIN",
    },
    {
        label: "Usuarios",
        path: "usuarios",
        link: `${PREFIX_ROUTES.ADMIN}${PREFIX_ROUTES.ELECCIONES}/${HEADER_MENU.USUARIOS}`,
        icon: IconUserPlus,
        color: "#1250fc",
        role: "RESPONSABLE",
    },
    /* {
        label: "Organizaciones",
        path: "organizaciones",
        link: "/admin/organizaciones",
        icon: IconSitemap,
        color: "#f72b72",
        role: "ADMIN",
    },
    {
        label: "Candidatos",
        path: "candidatos",
        link: "/admin/candidatos",
        icon: IconUserScan,
        color: "#0865ce",
        role: "ADMIN",
    }, */
    {
        label: "Preguntas",
        path: "preguntas",
        link: "/elecciones/consulta/preguntas",
        icon: IconQuestionMark,
        color: "#f39c12",
        role: "ADMIN",
    },
    /* {
        label: "Invitados",
        path: "guesses",
        link: "/admin/guesses",
        icon: IconUserStar,
        color: "#72d1d7",
        role: "ADMIN",
    }, */
    {
        label: "Cerrar sesión",
        path: "cerrar-sesion",
        link: "",
        icon: IconLogout,
        color: "#cc003d",
        role: "",
    },
];
