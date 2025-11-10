import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onActivateInfoActa,
    onActivateJunta,
    onActivatePreguntas,
    onActiveSearch,
    onClearActaConsulta,
    onLoadErrores,
    onLoading,
    onLoadMessage,
} from "../../../store/consulta/acta-consulta/actaConsultaSlice";
import apiAxios from "../../../api/apiAxios";

export const useActaConsultaStore = () => {
    const {
        loading,
        loadingActaConsulta,
        disabledSearch,

        actasConsulta,
        actasPaginacion,

        juntaInfo,
        info_acta,
        preguntas,

        message,
        errores,
    } = useSelector((state) => state.actaConsulta);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startActivateSearch = (behavior = false) => {
        dispatch(onActiveSearch(behavior));
    };

    const startLoadInfoActa = async (junta_id) => {
        if (!junta_id) return;

        try {
            dispatch(onLoading(true));

            const { data } = await apiAxios.get(
                "/general/actas-consulta/buscar/por-junta",
                { params: { junta_id } }
            );

            const { info_acta, ubicacion, preguntas } = data;

            dispatch(onActivateJunta(ubicacion));
            dispatch(onActivateInfoActa(info_acta));
            dispatch(onActivatePreguntas(preguntas));

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
                console.log("actualiza");
                //actualizando
                const { data } = await apiAxios.put(
                    `/general/acta-consulta/${acta.id}`,
                    acta
                );
                console.log("actualizo");
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                    startClearActaConsulta();
                }, 2000);
                return;
            }

            //creando
            console.log("creando");
            const { data } = await apiAxios.post(
                "/general/acta-consulta",
                acta
            );
            console.log('creo');
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

        actasConsulta,
        actasPaginacion,

        juntaInfo,
        info_acta,
        preguntas,

        message,
        errores,

        startActivateSearch,
        startLoadInfoActa,
        startAddActa,
        startClearActaConsulta,
    };
};
