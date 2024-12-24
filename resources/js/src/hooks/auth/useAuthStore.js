import { useMantineColorScheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onAuthenticate,
    onClearErrores,
    onLoadErrores,
    onLoading,
    onLoadProfile,
    onLoadToken,
    onLogout,
    onValidate,
} from "../../store/auth/authSlice";
import apiAxios from "../../api/apiAxios";

export const useAuthStore = () => {
    const { clearColorScheme } = useMantineColorScheme();
    const { isLoading, user, token, profile, validate, errores } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLogin = async ({ dni, password }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/auth/login", {
                dni,
                password,
            });
            const { usuario, access_token } = data;
            localStorage.setItem("service_user", JSON.stringify(usuario));
            localStorage.setItem("auth_token", access_token);
            localStorage.setItem("token_init_date", new Date().getTime());
            dispatch(onLoadToken(access_token));
            dispatch(onAuthenticate(usuario));
        } catch (error) {
            //console.log(error);
            error.response.data.errores
                ? dispatch(onValidate(error.response.data.errores))
                : dispatch(onLogout(error.response.data.msg));

            setTimeout(() => {
                //dispatch(onClearValidates());
                dispatch(onClearErrores());
            }, 2000);
        }
    };

    const checkAuthToken = async () => {
        //const token = localStorage.getItem("auth_token");
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await apiAxios.get("/refresh");
            const { usuario, access_token } = data;
            localStorage.setItem("service_user", JSON.stringify(usuario));
            localStorage.setItem("auth_token", access_token);
            localStorage.setItem("token_init_date", new Date().getTime());
            dispatch(onAuthenticate(usuario));
            dispatch(onLoadToken(access_token));
        } catch (error) {
            //console.log(error);
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    const startProfile = async () => {
        try {
            dispatch(onLoading(true));
            //const user = await JSON.parse(localStorage.getItem("service_user"));
            const { data } = await apiAxios.get("/profile");
            const { profile } = data;
            dispatch(onLoadProfile(profile));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const clearProfile = () => {
        dispatch(onLoadProfile({}));
    };

    const startLogout = async () => {
        try {
            await apiAxios.post("/auth/logout");
            localStorage.clear();
            dispatch(onLogout());
            clearColorScheme();
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
            clearColorScheme();
        }
    };

    return {
        isLoading,
        user,
        token,
        profile,
        validate,
        errores,

        startLogin,
        checkAuthToken,
        startProfile,
        clearProfile,
        startLogout
    };
};
