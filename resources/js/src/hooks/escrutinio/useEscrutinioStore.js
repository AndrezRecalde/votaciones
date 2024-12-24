import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import { onClearEscrutinios, onLoadErrores, onLoadEscrutinios, onLoading } from "../../store/admin/escrutinio/escrutinioSlice";
import apiAxios from "../../api/apiAxios";

export const useEscrutinioStore = () => {
    const { isLoading, resultadosEscrutinio, progressEscrutinio, errores } = useSelector(
        (state) => state.escrutinio
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadEscrutinios = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                "/admin/resultado/escrutinio"
            );
            const { escrutinios } = data;
            dispatch(onLoadEscrutinios(escrutinios));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    }

    const startLoadEscrutinioActas = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                "/general/escrutinio-dignidades"
            );
            const { total } = data;
            dispatch(onLoadEscrutinios(total));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    }


    const startClearEscrutinios = () => {
        dispatch(onClearEscrutinios());
    }

    return {
        isLoading,
        resultadosEscrutinio,
        progressEscrutinio,
        errores,

        startLoadEscrutinios,
        startLoadEscrutinioActas,
        startClearEscrutinios
    };
};
