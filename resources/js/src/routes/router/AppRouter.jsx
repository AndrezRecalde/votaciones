import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppHeaderMenu } from "../../layouts";
import { PublicRoutes } from "../public/PublicRoutes";
import { authRoutes, guessRoutes, peerLinks, routes } from "./routes";
import RoutesNotFound from "../not-found/RoutesNotFound";
import { useAuthStore } from "../../hooks";
import { AuthGuard, PrivateRoutes } from "../private";

const AuthRoutes = () => (
    <PublicRoutes>
        <Routes>
            <Route path={authRoutes.path} element={<authRoutes.Component />} />
            <Route
                path="/*"
                element={<Navigate replace to={authRoutes.link} />}
            />
        </Routes>
    </PublicRoutes>
);

export const AppRouter = () => {
    const { checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []);

    const renderRoutes = (routeConfig) => {
        return routeConfig.map(({ path, Component, roles }) => (
            <Route
                key={path}
                path={path}
                element={
                    <PrivateRoutes requiredRole={roles}>
                        <AppHeaderMenu>
                            <Component />
                        </AppHeaderMenu>
                    </PrivateRoutes>
                }
            />
        ));
    };

    const renderStaffRoutes = (routeConfig) => {
        return routeConfig.map(({ path, Component }) => (
            <Route
                key={path}
                path={path}
                element={
                    <AuthGuard>
                        <AppHeaderMenu>
                            <Component />
                        </AppHeaderMenu>
                    </AuthGuard>
                }
            />
        ));
    };

    return (
        <RoutesNotFound>
            <Route path="/*" element={<AuthRoutes />} />
            <Route
                path={guessRoutes.path}
                element={<guessRoutes.Component />}
            />
            <Route
                path="/admin/*"
                element={
                    <RoutesNotFound>
                        {renderRoutes(routes.admin)}
                    </RoutesNotFound>
                }
            />
            <Route
                path="/general/*"
                element={
                    <RoutesNotFound>
                        {renderRoutes(routes.digitador)}
                    </RoutesNotFound>
                }
            />
            <Route
                path="/staff/d/*"
                element={
                    <RoutesNotFound>
                        {renderStaffRoutes(peerLinks.peer)}
                    </RoutesNotFound>
                }
            />
        </RoutesNotFound>
    );
};
