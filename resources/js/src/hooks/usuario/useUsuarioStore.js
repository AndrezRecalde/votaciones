import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onClearUsuarios,
    onDeleteUsuario,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onLoadUsuarios,
    onSetActivateUsuario,
} from "../../store/admin/usuario/usuarioSlice";
import apiAxios from "../../api/apiAxios";

export const useUsuarioStore = () => {
    const { isLoading, usuarios, activateUsuario, message, errores } =
        useSelector((state) => state.usuario);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadUsuarios = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/usuarios");
            const { usuarios } = data;
            dispatch(onLoadUsuarios(usuarios));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startAddUsuario = async (usuario) => {
        try {
            if (usuario.id) {
                const { data } = await apiAxios.put(
                    `/admin/update/usuario/${usuario.id}`,
                    usuario
                );
                startLoadUsuarios();
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                }, 40);
                return;
            }
            const { data } = await apiAxios.post(
                "/admin/store/usuario",
                usuario
            );
            startLoadUsuarios();
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startDeleteUsuario = async (usuario) => {
        try {
            const { data } = await apiAxios.delete(
                `/admin/delete/usuario/${usuario.id}`
            );
            dispatch(onDeleteUsuario());
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startChangePwdUser = async (id, password) => {
        try {
            const { data } = await helpdeskApi.put(`/change-password/${id}`, {
                password,
            });
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startUpdateActivo = async (usuario) => {
        try {
            const { data } = await apiAxios.put(
                `/admin/update/status/usuario/${usuario.id}`,
                usuario
            );
            startLoadUsuarios();
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const setActivateUsuario = (usuario) => {
        dispatch(onSetActivateUsuario(usuario));
    };

    const startClearUsuarios = () => {
        dispatch(onClearUsuarios());
    };

    return {
        isLoading,
        usuarios,
        activateUsuario,
        message,
        errores,

        startLoadUsuarios,
        startAddUsuario,
        startDeleteUsuario,
        startChangePwdUser,
        startUpdateActivo,
        setActivateUsuario,
        startClearUsuarios,
    };
};
