import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onActivateJunta,
    onActivatePregunta,
    onActiveSearch,
    onClearActaConsulta,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onSetActaExistente,
} from "../../../store/consulta/acta-consulta/actaConsultaSlice";
import apiAxios from "../../../api/apiAxios";

export const useActaConsultaStore = () => {
    const {
        loading,
        loadingActaConsulta,
        disabledSearch,
        existeActaConsulta,
        actasConsulta,
        actasPaginacion,
        juntaInfo,
        actaExistente,
        pregunta,
        message,
        errores,
    } = useSelector((state) => state.actaConsulta);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startActivateSearch = (behavior = false) => {
        dispatch(onActiveSearch(behavior));
    };

    const startLoadInfoActa = async (junta_id, pregunta_id) => {
        if (!junta_id || !pregunta_id) return;

        try {
            dispatch(onLoading(true));

            const { data: res } = await apiAxios.get(
                "/general/actas-consulta/buscar/por-junta",
                { params: { junta_id, pregunta_id } }
            );

            if (!res?.success) {
                if (res?.message) ExceptionMessageError(res.message);
                return;
            }

            const { existe_acta, ubicacion, pregunta, mensaje } = res;

            dispatch(onActivateJunta(ubicacion));
            dispatch(onSetActaExistente(existe_acta));

            // Si tu store espera un único objeto:
            dispatch(onActivatePregunta(pregunta));

            // opcional: mostrar mensaje informativo
            // if (mensaje) toast.info(mensaje);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startAddActa = async (acta) => {
        try {
            if (acta.id) {
                //actualizando
                const { data } = await apiAxios.put(
                    `/general/acta-consulta/${acta.id}`,
                    acta
                );
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                    startClearActaConsulta();
                }, 2000);
                return;
            }

            //creando
            const { data } = await apiAxios.post(
                "/general/acta-consulta",
                acta
            );
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
                startClearActaConsulta();
            }, 2000);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startClearActaConsulta = () => {
        dispatch(onClearActaConsulta());
    };

    return {
        loading,
        loadingActaConsulta,
        disabledSearch,
        existeActaConsulta,
        actasConsulta,
        actasPaginacion,
        juntaInfo,
        actaExistente,
        pregunta,
        message,
        errores,

        startActivateSearch,
        startLoadInfoActa,
        startAddActa,
        startClearActaConsulta
    };
};
