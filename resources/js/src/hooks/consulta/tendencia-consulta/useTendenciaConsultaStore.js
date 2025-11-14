import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onClearTendenciasConsulta,
    onLoadErrores,
    onLoading,
    onLoadTendenciasConsulta,
} from "../../../store/consulta/tendencia-consulta/tendenciaConsultaSlice";
import apiAxios from "../../../api/apiAxios";

export const useTendenciaConsultaStore = () => {
    const { pageLoad, isLoading, tendenciasConsulta, errores, message } =
        useSelector((state) => state.tendenciaConsulta);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadTendenciasConsulta = async ({ zona_id, pregunta_id }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                "/admin/seguimiento-juntas-consulta",
                {
                    params: {
                        zona_id,
                        pregunta_id,
                    },
                }
            );
            const { tendenciasConsulta:tendencias } = data;
            //console.log(tendencias);
            dispatch(onLoadTendenciasConsulta(tendencias));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startClearTendenciasConsulta = () => {
        dispatch(onClearTendenciasConsulta());
    }

    return {
        pageLoad,
        isLoading,
        tendenciasConsulta,
        errores,
        message,

        startLoadTendenciasConsulta,
        startClearTendenciasConsulta,
    };
};
