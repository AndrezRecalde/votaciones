import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onClearEscrutinioConsulta,
    onLoadErrores,
    onLoadEscrutinioConsulta,
    onLoading,
} from "../../../store/consulta/escrutinio-consulta/escrutinioConsultaSlice";
import apiAxios from "../../../api/apiAxios";

export const useEscrutinioConsultaStore = () => {
    const {
        isLoading,
        escrutinioConsulta,
        progresoEscrutinioConsulta,
        errores,
    } = useSelector((state) => state.escrutinioConsulta);
    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadEscrutinioConsulta = async (params) => {
        console.log(params);
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                "/admin/escrutinio/drill",
                { params }
            );
            console.log(data);
            dispatch(onLoadEscrutinioConsulta(data.data));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startClearEscrutinioConsulta = () => {
        dispatch(onClearEscrutinioConsulta());
    };

    return {
        isLoading,
        escrutinioConsulta,
        progresoEscrutinioConsulta,
        errores,

        startLoadEscrutinioConsulta,
        startClearEscrutinioConsulta
    };
};
