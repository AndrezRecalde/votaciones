import { Component, lazy } from "react";
import { IconBuilding, IconBuildingBank, IconBuildingSkyscraper, IconListDetails, IconListNumbers, IconLogout, IconSettings, IconSitemap, IconUserHexagon, IconUserPlus, IconUserScan, IconUsersGroup, IconUserStar } from "@tabler/icons-react";

const AuthPage = lazy(() => import(/* webpackChunkName: "AuthPage" */ "../../pages/auth/AuthPage"));
const ChangePwdPage = lazy(() => import(/* webpackChunkName: "ChangePwdPage" */ '../../pages/user/ChangePwdPage'));

const UsuariosPage = lazy(() => import(/* webpackChunkName: "UsuariosPage" */ '../../pages/user/UsuariosPage'));
const GuessesPage = lazy(() => import(/* webpackChunkName: "UsuariosPage" */ '../../pages/admin/guesses/GuessesPage'));
const CandidatosPage = lazy(() => import(/* webpackChunkName: "CandidatosPage" */ '../../pages/admin/candidato/CandidatosPage'));
const OrganizacionesPage = lazy(() => import(/* webpackChunkName: "OrganizacionesPage" */ '../../pages/admin/organizaciones/OrganizacionesPage'));

const ResultadosBinomiosPage = lazy(() => import(/* webpackChunkName: "ResultadosBinomiosPage" */ '../../pages/resultados/ResultadosBinomiosPage'));
const ResultadosWebsterPage = lazy(() => import(/* webpackChunkName: "ResultadosWebsterPage" */ '../../pages/resultados/ResultadosWebsterPage'));

const TendenciaPage = lazy(() => import(/* webpackChunkName: "TendenciaPage" */ '../../pages/tendencia/TendenciaPage'));


const EscrutinioPage = lazy(() => import(/* webpackChunkName: "EscrutinioPage" */ '../../pages/escrutinio/EscrutinioPage'));

const BusquedaActaPage = lazy(() => import(/* webpackChunkName: "BusquedaActaPage" */ '../../pages/acta/BusquedaActaPage'));

const GuessesResultadosPage = lazy(() => import(/* webpackChunkName: "GuessResultadosPage" */ '../../pages/guess/GuessResultadosPage'));


const ProfilePage = lazy(() => import(/* webpackChunkName: "ProfilePage" */ "../../pages/user/ProfilePage"));


const DigitacionPage = lazy(() => import(/* webpackChunkName: "DigitacionPage" */ "../../pages/digitacion/DigitacionPage"));


const ErrorNotFound = lazy(() => import(/* webpackChunkName: "ErrorNotFound" */ '../../pages/error/ErrorNotFound'));


const generateRoutes = (basePath, components, roles) =>
    components.map(({ path, Component }) => ({
        path: `${path}`,
        link: `${basePath}${path}`,
        Component,
        roles,
    }));

export const PREFIX_ROUTES = {
    ADMIN: "/admin",
    DIGITADOR: "/general"
}

export const HEADER_MENU = {
    DIGITACION: "digitacion-acta",
    RESULTADO_BINOMIOS: "binomios-resultados",
    RESULTADO_WEBSTER: "webster-resultados",
    ESCRUTINIO: "escrutinio",
    TENDENCIA: "tendencia",
    ACTAS: "actas",
    GUESSES_RESULTADOS: "guesses-resultados",
}

export const authRoutes = {
    path: "auth/login/*",
    link: "auth/login",
    Component: AuthPage,
};

export const guessRoutes = {
    path: "guesses/resultados",
    link: "guesses/resultados",
    Component: GuessesResultadosPage,
}

const adminRoutes = generateRoutes(
    "admin",
    [
        { path: "usuarios", Component: UsuariosPage },
        { path: "guesses", Component: GuessesPage },
        { path: "candidatos", Component: CandidatosPage },
        { path: "organizaciones", Component: OrganizacionesPage },
        //{ path: HEADER_MENU.DIGITACION, Component: DigitacionPage },
        { path: HEADER_MENU.ESCRUTINIO, Component: EscrutinioPage },
        { path: HEADER_MENU.RESULTADO_BINOMIOS, Component: ResultadosBinomiosPage },
        { path: HEADER_MENU.RESULTADO_WEBSTER, Component: ResultadosWebsterPage },
        { path: HEADER_MENU.TENDENCIA, Component: TendenciaPage },
        { path: HEADER_MENU.ACTAS, Component: BusquedaActaPage },

    ],
    ["ADMIN", "RESPONSABLE"]
);

const digitadorRoutes = generateRoutes(
    "general",
    [
        { path: "digitacion-acta", Component: DigitacionPage },
    ],
    ["ADMIN", "DIGITADOR", "RESPONSABLE"]
);

const peerRoutes = generateRoutes(
    "staff/d",
    [
        { path: "profile", Component: ProfilePage },
        { path: "change-password", Component: ChangePwdPage },
    ],
    [""]
);


export const routes = {
    //auth: authRoutes,
    admin: adminRoutes,
    digitador: digitadorRoutes,
    //usuario: usuarioRoutes,
    //peer: peerRoutes,
};


export const peerLinks = {
    peer: peerRoutes
}

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
        path: "profile",
        link: "/staff/d/profile",
        icon: IconUserHexagon,
        color: "#12b561",
        role: ""
    },
    {
        label: "Cambiar contraseña",
        path: "change-password",
        link: "/staff/d/change-password",
        icon: IconSettings,
        color: "#6d7c85",
        role: ""
    },
    {
        label: "Usuarios",
        path: "usuarios",
        link: "/admin/usuarios",
        icon: IconUserPlus,
        color: "#1250fc",
        role: "ADMIN"
    },
    {
        label: "Usuarios",
        path: "usuarios",
        link: "/admin/usuarios",
        icon: IconUserPlus,
        color: "#1250fc",
        role: "RESPONSABLE"
    },
    {
        label: "Organizaciones",
        path: "organizaciones",
        link: "/admin/organizaciones",
        icon: IconSitemap,
        color: "#f72b72",
        role: "ADMIN"
    },
    {
        label: "Candidatos",
        path: "candidatos",
        link: "/admin/candidatos",
        icon: IconUserScan,
        color: "#0865ce",
        role: "ADMIN"
    },
    {
        label: "Invitados",
        path: "guesses",
        link: "/admin/guesses",
        icon: IconUserStar,
        color: "#72d1d7",
        role: "ADMIN"
    },
    {
        label: "Cerrar sesión",
        path: "cerrar-sesion",
        link: "",
        icon: IconLogout,
        color: "#cc003d",
        role: ""
    },
];
