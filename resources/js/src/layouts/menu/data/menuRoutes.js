import { IconBuilding, IconBuildingBank, IconListCheck } from "@tabler/icons-react";
import {
    HEADER_MENU,
    HEADER_MENU_CONSULTA,
    PREFIX_ROUTES,
} from "../../../routes/router/routes";

export const NavResultados = {
    CANDIDATOS: [
        {
            icon: IconBuildingBank,
            title: "Resultados Binomios",
            path: `${PREFIX_ROUTES.ELECCIONES}/binomios/${HEADER_MENU.RESULTADO_BINOMIOS}`,
            link: `${PREFIX_ROUTES.ELECCIONES}/binomios/${HEADER_MENU.RESULTADO_BINOMIOS}`,
            link: `${PREFIX_ROUTES.ELECCIONES}/binomios/${HEADER_MENU.RESULTADO_BINOMIOS}`,
            roles: ["ADMIN", "RESPONSABLE", "USER"],
        },
    ],
};

export const NavResultadosConsulta = {
    CANDIDATOS: [
        {
            icon: IconListCheck,
            title: "Resultados Consulta",
            path: `${PREFIX_ROUTES.ELECCIONES_CONSULTA}/${HEADER_MENU_CONSULTA.RESULTADO_CONSULTA}`,
            link: `${PREFIX_ROUTES.ELECCIONES_CONSULTA}/${HEADER_MENU_CONSULTA.RESULTADO_CONSULTA}`,
            link: `${PREFIX_ROUTES.ELECCIONES_CONSULTA}/${HEADER_MENU_CONSULTA.RESULTADO_CONSULTA}`,
            roles: ["ADMIN", "RESPONSABLE", "USER"],
        },
    ],
};

export const NavRevisarActasConsulta = {
    ACTAS: [
        {
            icon: IconListCheck,
            title: "Revisar Actas",
            path: `${PREFIX_ROUTES.ELECCIONES_DIGITACION}/${HEADER_MENU_CONSULTA.ACTAS_CONSULTA}`,
            link: `${PREFIX_ROUTES.ELECCIONES_DIGITACION}/${HEADER_MENU_CONSULTA.ACTAS_CONSULTA}`,
            link: `${PREFIX_ROUTES.ELECCIONES_DIGITACION}/${HEADER_MENU_CONSULTA.ACTAS_CONSULTA}`,
            roles: ["ADMIN", "RESPONSABLE", "DIGITADOR"],
        },
    ],
    JUNTAS: [
        {
            icon: IconBuilding,
            title: "Reporte Juntas",
            path: `${PREFIX_ROUTES.ELECCIONES_DIGITACION}/${HEADER_MENU_CONSULTA.REPORTE_JUNTAS_CONSULTA}`,
            link: `${PREFIX_ROUTES.ELECCIONES_DIGITACION}/${HEADER_MENU_CONSULTA.REPORTE_JUNTAS_CONSULTA}`,
            link: `${PREFIX_ROUTES.ELECCIONES_DIGITACION}/${HEADER_MENU_CONSULTA.REPORTE_JUNTAS_CONSULTA}`,
            roles: ["ADMIN", "RESPONSABLE", "DIGITADOR"],
        },
    ],
};
