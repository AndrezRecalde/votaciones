import { Navigate, useLocation } from "react-router-dom";
import { ErrorAccessDenied } from "../../../pages";
import { PREFIX_ROUTES } from "../../router/routes";

export const PrivateRoutes = ({
    redirectPath = `${PREFIX_ROUTES.AUTH_ROUTES}`,
    children,
    requiredRole, // Ahora puede ser un string (un solo rol) o un array de roles
}) => {
    const location = useLocation();
    const token = localStorage.getItem("auth_token");
    const user = JSON.parse(localStorage.getItem("service_user"));

    // Verificar si el usuario está autenticado
    if (!token) {
        return <Navigate to={redirectPath} state={{ from: location }} />;
    }

    // Verificar si el usuario tiene el rol requerido
    const userHasRequiredRole = requiredRole
        ? Array.isArray(requiredRole)
            ? requiredRole.includes(user?.role) // Si requiredRole es un array, verifica si el rol del usuario está incluido
            : requiredRole === user?.role // Si requiredRole es un string, compara directamente
        : true; // Si no se especifica requiredRole, se permite el acceso

    // Si el usuario no tiene el rol requerido, mostrar el componente de acceso denegado
    if (!userHasRequiredRole) {
        return <ErrorAccessDenied />;
    }

    // Si el usuario está autenticado y tiene el rol requerido, renderizar los children
    return children;
};
