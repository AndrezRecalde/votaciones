import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onClearDignidades,
    onLoadDignidades,
    onLoadErrores,
    onLoading,
    onLoadMessage,
} from "../../store/admin/dignidad/dignidadSlice";
import apiAxios from "../../api/apiAxios";

export const useDignidadStore = () => {
    const { isLoading, dignidades, activateDignidad, message, errores } =
        useSelector((state) => state.dignidad);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadDignidades = async ({ activo = null, tipo = null}) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/dignidades", {
                activo,
                tipo
            });
            const { dignidades } = data;
            dispatch(onLoadDignidades(dignidades));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadDignidadesGuess = async ({ activo = null, tipo = null}) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/dignidades", {
                activo,
                tipo
            });
            const { dignidades } = data;
            dispatch(onLoadDignidades(dignidades));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startUpdateStatusDignidad = async (dignidad) => {
        try {
            const { data } = await apiAxios.get(
                `/admin/update/dignidad/${dignidad.id}`,
                dignidad
            );
            startLoadDignidades();
            dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                }, 40);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startClearDignidades = () => {
        dispatch(onClearDignidades());
    }

    return {
        isLoading,
        dignidades,
        activateDignidad,
        message,
        errores,

        startLoadDignidades,
        startLoadDignidadesGuess,
        startUpdateStatusDignidad,
        startClearDignidades
    };
};
