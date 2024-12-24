import { Navigate, useLocation } from "react-router-dom";
import { ErrorAccessDenied } from "../../../pages";

export const PrivateRoutes = ({
    redirectPath = "/auth/login",
    children,
    requiredRole,
}) => {
    let location = useLocation();
    const token = localStorage.getItem("auth_token");
    //const { token } = useAuthStore();
    const user = JSON.parse(localStorage.getItem("service_user"));

    const userHasRequiredRole =
        token && requiredRole === user.role ? true : false;

    if (!token) {
        return <Navigate to={redirectPath} state={{ from: location }} />;
    }
    if (token && !userHasRequiredRole) {
        return <ErrorAccessDenied />;
    }
    return children;
};
