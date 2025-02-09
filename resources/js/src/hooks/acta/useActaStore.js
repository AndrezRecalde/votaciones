import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onActivateActa,
    onActivateCandidatos,
    onActivateJunta,
    onActiveSearch,
    onClearActa,
    onLoadActas,
    onLoadErrores,
    onLoading,
    onLoadMessage,
} from "../../store/admin/acta/actaSlice";
import apiAxios from "../../api/apiAxios";

export const useActaStore = () => {
    const {
        pageLoad,
        isLoading,
        disabledSearch,
        existeActa,
        actas,
        activateJunta,
        activateActa,
        activateCandidatos,
        message,
        errores,
    } = useSelector((state) => state.acta);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startActivateSearch = (behavior = false) => {
        dispatch(onActiveSearch(behavior));
    };

    const startLoadInfoJunta = async (junta_id) => {
        try {
            const { data } = await apiAxios.post("/general/informacion/junta", {
                junta_id,
            });
            const { infoJunta } = data;
            dispatch(onActivateJunta(infoJunta));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadActa = async (dignidad_id, junta_id) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post(
                "/general/digitacion/buscar/acta",
                {
                    dignidad_id,
                    junta_id,
                }
            );
            const { status, acta } = data;
            if (status) {
                dispatch(onActivateActa(acta));
                return;
            }
            dispatch(onLoading(false));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadCandidatos = async ({
        dignidad_id,
        provincia_id,
        canton_id,
        parroquia_id,
        id = null,
    }) => {
        try {
            const { data } = await apiAxios.post(
                "/general/acta/listar/dignidades",
                {
                    dignidad_id,
                    provincia_id,
                    canton_id,
                    parroquia_id,
                    acta_id: id,
                }
            );
            //console.log(data);
            const { candidatos } = data;
            //console.log(candidatos)
            dispatch(onActivateCandidatos(candidatos));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startAddActa = async (seleccion, acta) => {
        try {
            const finalForm = { ...seleccion, ...acta };
            const { data } = await apiAxios.post(
                "/general/digitacion/store/acta",
                finalForm
            );
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
                dispatch(onClearActa());
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startUpdateActa = async (id, seleccion, acta) => {
        try {
            const finalForm = { id, ...seleccion, ...acta };
            const { data } = await apiAxios.post(
                "/general/digitacion/update/acta",
                finalForm
            );
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
                dispatch(onClearActa());
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadActas = async (seleccion) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post(
                "/admin/listar/actas",
                seleccion
            );
            const { actas } = data;
            dispatch(onLoadActas(actas));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    }

    const startExportExcelActas = async (seleccion) => {
        try {
            const { data } = await apiAxios.post(
                "/admin/exportar/actas",
                seleccion,
                {
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "actas.xlsx");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    }

    const startClearActa = () => {
        dispatch(onClearActa());
    };

    return {
        pageLoad,
        isLoading,
        disabledSearch,
        existeActa,
        actas,
        activateJunta,
        activateActa,
        activateCandidatos,
        message,
        errores,

        startActivateSearch,
        startLoadInfoJunta,
        startLoadActa,
        startLoadCandidatos,
        startAddActa,
        startUpdateActa,
        startLoadActas,
        startExportExcelActas,
        startClearActa,
    };
};
