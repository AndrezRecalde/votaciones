import { IconBuildingBank } from "@tabler/icons-react";

export const NavResultados = {
    CANDIDATOS: [
        {
            icon: IconBuildingBank,
            title: "Resultados Binomios",
            path: "binomios-resultados",
            link: "/admin/binomios-resultados",
            roles: ["ADMIN", "RESPONSABLE", "USER"],
        },
    ],
    CONSULTA: [
        {
            icon: IconBuildingBank,
            title: "Consulta Resultados",
            path: "consulta-resultados",
            link: "/admin/consulta-resultados",
            roles: ["ADMIN", "RESPONSABLE", "USER"],
        },
    ],
};


