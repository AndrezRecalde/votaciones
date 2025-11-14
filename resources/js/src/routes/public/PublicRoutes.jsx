import { Navigate, useLocation } from "react-router-dom";
import { GENERAL_ROUTES, PREFIX_ROUTES } from "../router/routes";

export const PublicRoutes = ({ children }) => {
    const token = localStorage.getItem("auth_token");
    //const { token } = useAuthStore();
    const { state } = useLocation();

    const pathname =
        state?.from?.pathname ??
        `${PREFIX_ROUTES.ELECCIONES}/${GENERAL_ROUTES.PERFIL}`;
    //console.log(pathname)

    return !token ? children : <Navigate to={pathname} />;
};
