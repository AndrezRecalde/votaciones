import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onClearResultadoConsulta,
    onLoadErrores,
    onLoading,
    onLoadNumeroElectores,
    onLoadResultados,
    onLoadTotales,
    onSetFiltrosAplicados,
} from "../../../store/consulta/resultado/resultadoConsultaSlice";
import apiAxios from "../../../api/apiAxios";

export const useResultadoConsultaStore = () => {
    const {
        loading,
        loadingResultados,
        numero_electores,
        totales,
        resultados,
        filtrosAplicados,
        message,
        errores,
    } = useSelector((state) => state.resultadoConsulta);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadResultadosPorPregunta = async (filtros) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                "/admin/actas-consulta/resultados-por-pregunta",
                {
                    params: filtros,
                }
            );
            const {
                status,
                resultados: resultadosConsulta,
                poblacion_electoral,
                acumulado_simple,
                filtros_aplicados,
            } = data.data;
            dispatch(onLoadNumeroElectores(poblacion_electoral));
            dispatch(onLoadTotales(acumulado_simple));
            dispatch(onLoadResultados(resultadosConsulta));
            dispatch(onSetFiltrosAplicados(filtros_aplicados));
        } catch (error) {
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startClearResultadosConsulta = () => {
        dispatch(onClearResultadoConsulta());
    };

    return {
        loading,
        loadingResultados,
        numero_electores,
        totales,
        resultados,
        filtrosAplicados,
        message,
        errores,

        startLoadResultadosPorPregunta,
        startClearResultadosConsulta,
    };
};
