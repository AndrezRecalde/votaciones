import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../hooks";
import {
    onClearTendencias,
    onLoadErrores,
    onLoading,
    onLoadTendencias,
} from "../../store/admin/tendencia/tendenciaSlice";
import apiAxios from "../../api/apiAxios";

export const useTendenciaStore = () => {
    const { pageLoad, isLoading, tendencias, tenciasChart } = useSelector(
        (state) => state.tendencia
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadTendencias = async ({ dignidad_id, zona_id }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post(
                "/admin/resultados/tendencia/zonas",
                {
                    dignidad_id,
                    zona_id,
                }
            );
            const { tendencias } = data;
            dispatch(onLoadTendencias(tendencias));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startClearTendencias = () => {
        dispatch(onClearTendencias());
    };

    return {
        pageLoad,
        isLoading,
        tendencias,
        tenciasChart,

        startLoadTendencias,
        startClearTendencias,
    };
};
