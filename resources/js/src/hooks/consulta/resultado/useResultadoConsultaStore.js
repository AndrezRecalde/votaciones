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

    const startExportarResultadosConsulta = async () => {
        try {
            dispatch(onLoading(true));

            const response = await apiAxios.get(
                "/admin/exportar-resultados-consulta",
                {
                    responseType: "blob", // importante para archivos
                }
            );

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "resultados_consulta.pdf"); // nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startExportarResultadosConsultaExcel = async () => {
        try {
            dispatch(onLoading(true));

            const response = await apiAxios.get(
                "/admin/exportar-resultados-consulta-excel",
                {
                    responseType: "blob", // importante para archivos
                }
            );

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "resultados_consulta.xlsx"); // nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            //console.log(error);
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
        startExportarResultadosConsulta,
        startExportarResultadosConsultaExcel
    };
};
