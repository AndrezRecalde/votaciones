import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onClearEscrutinioConsulta,
    onLoadErrores,
    onLoadEscrutinioConsulta,
    onLoading,
    onSetReporte,
    onSetResumenGeneral,
    onSetResumenUsuario,
} from "../../../store/consulta/escrutinio-consulta/escrutinioConsultaSlice";
import apiAxios from "../../../api/apiAxios";

export const useEscrutinioConsultaStore = () => {
    const {
        isLoading,
        escrutinioConsulta,
        progresoEscrutinioConsulta,
        resumenUsuario,
        resumenGeneral,
        reporte,
        errores,
    } = useSelector((state) => state.escrutinioConsulta);
    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadEscrutinioConsulta = async (params) => {
        //console.log(params);
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/escrutinio/drill", {
                params,
            });
            //console.log(data);
            dispatch(onLoadEscrutinioConsulta(data.data));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startLoadResumenUsuario = async (usuario_id) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                "/general/actas-consulta/resumen-estadistico",
                {
                    params: { usuario_id },
                }
            );
            const { data: datos } = data;
            //console.log(datos);
            dispatch(onSetResumenUsuario(datos.usuario));
            dispatch(onSetResumenGeneral(datos.general));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startLoadReporteProvincia = async (provinciaId) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get(
                `/general/reporte/provincia/${provinciaId}`
            );
            const { reporte } = data;
            //console.log(reporte);
            dispatch(onSetReporte(reporte));
        } catch (error) {
            //console.log(error);
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
        resumenUsuario,
        resumenGeneral,
        reporte,
        errores,

        startLoadEscrutinioConsulta,
        startClearEscrutinioConsulta,
        startLoadResumenUsuario,
        startLoadReporteProvincia
    };
};
