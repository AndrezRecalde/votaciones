import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onClearOrganizaciones,
    onDeleteOrganizacion,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onLoadOrganizaciones,
    onSetActivateOrganizacion,
} from "../../store/admin/organizacion/organizacionSlice";
import apiAxios from "../../api/apiAxios";

export const useOrganizacionStore = () => {
    const {
        isLoading,
        organizaciones,
        activateOrganizacion,
        message,
        errores,
    } = useSelector((state) => state.organizacion);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadOrganizaciones = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/organizaciones");
            const { organizaciones } = data;
            dispatch(onLoadOrganizaciones(organizaciones));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startAddOrganizacion = async (organizacion) => {
        try {
            if (organizacion.id) {
                const { data } = await apiAxios.post(
                    `/admin/update/organizacion/${organizacion.id}`,
                    organizacion,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                startLoadOrganizaciones();
                dispatch(onLoadMessage(data));
                setActivateOrganizacion(null);
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                }, 40);
                return;
            }
            const { data } = await apiAxios.post(
                "/admin/store/organizacion",
                organizacion,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            startLoadOrganizaciones();
            dispatch(onLoadMessage(data));
            setActivateOrganizacion(null);
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startDeleteOrganizacion = async (organizacion) => {
        try {
            const { data } = await apiAxios.delete(
                `/admin/delete/organizacion/${organizacion.id}`
            );
            dispatch(onDeleteOrganizacion());
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const setActivateOrganizacion = (organizacion) => {
        dispatch(onSetActivateOrganizacion(organizacion));
    };

    const startClearOrganizaciones = () => {
        dispatch(onClearOrganizaciones());
    };

    return {
        isLoading,
        organizaciones,
        activateOrganizacion,
        message,
        errores,

        startLoadOrganizaciones,
        startAddOrganizacion,
        startDeleteOrganizacion,
        setActivateOrganizacion,
        startClearOrganizaciones,
    };
};
