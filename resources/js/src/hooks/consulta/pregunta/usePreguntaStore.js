import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../../error/useErrorException";
import {
    onClearPreguntas,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onLoadPaginacion,
    onLoadPreguntas,
    onSetActivatePregunta,
} from "../../../store/consulta/pregunta/preguntaSlice";
import apiAxios from "../../../api/apiAxios";

export const usePreguntaStore = () => {
    const {
        isLoading,
        preguntas,
        paginacion,
        activatePregunta,
        message,
        errores,
    } = useSelector((state) => state.pregunta);
    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadPreguntas = async ({ page = 1, per_page = 20, all = false } = {}) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/preguntas-consulta", {
                params: { page, per_page, all },
            });
            //console.log(data);
            const { preguntas, paginacion } = data;
            dispatch(onLoadPreguntas(preguntas));
            dispatch(onLoadPaginacion(paginacion));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startAddPregunta = async (pregunta) => {
        try {
            if (pregunta.id) {
                dispatch(onLoading(true));
                const { data } = await apiAxios.put(
                    `/admin/pregunta-consulta/${pregunta.id}`,
                    pregunta
                );
                startLoadPreguntas({
                    page: paginacion.pagina_actual,
                    per_page: paginacion.por_pagina,
                });
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                }, 40);
                return;
            }
            dispatch(onLoading(true));
            const { data } = await apiAxios.post(
                "/admin/pregunta-consulta",
                pregunta
            );
            startLoadPreguntas({
                page: paginacion.pagina_actual,
                per_page: paginacion.por_pagina,
            });
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 2000);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        } finally {
            dispatch(onLoading(false));
        }
    };

    const startDeletePregunta = async (pregunta) => {
        try {
            const { data } = await apiAxios.delete(
                `/admin/pregunta-consulta/${pregunta.id}`
            );
            startLoadPreguntas({
                page: paginacion.pagina_actual,
                per_page: paginacion.por_pagina,
            });
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startUpdateActivo = async (pregunta) => {
        try {
            const { data } = await apiAxios.put(
                `/admin/update/status/pregunta-consulta/${pregunta.id}`,
                pregunta
            );
            startLoadPreguntas({
                page: paginacion.pagina_actual,
                per_page: paginacion.por_pagina,
            });
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const setActivatePregunta = (pregunta) => {
        dispatch(onSetActivatePregunta(pregunta));
    };

    const startClearPreguntas = () => {
        dispatch(onClearPreguntas());
    };

    return {
        isLoading,
        preguntas,
        paginacion,
        activatePregunta,
        message,
        errores,

        startLoadPreguntas,
        startAddPregunta,
        startDeletePregunta,
        startUpdateActivo,
        setActivatePregunta,
        startClearPreguntas,
    };
};
