import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onClearResultados,
    onClearResultadosMap,
    onExport,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onLoadResultadosCandidatos,
    onLoadResultadosForMap,
    onLoadTotalDeVotos,
    onLoadTotalIngresadas,
    onLoadTotalJuntas,
    onSending,
} from "../../store/resultados/resultadosSlice";
import apiAxios from "../../api/apiAxios";

export const useResultadoStore = () => {
    const {
        pageLoad,
        isLoading,
        isSendingWhats,
        isExport,
        totalDeVotos,
        totalActasIngresadas,
        totalJuntas,
        resultadoCandidatos,
        resultadosForMap,
        message,
        errores,
    } = useSelector((state) => state.resultados);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadTotalDeVotos = async ({
        dignidad_id,
        provincia_id,
        canton_id = null,
        parroquia_id = null,
    }) => {
        try {
            const { data } = await apiAxios.post(
                "/admin/resultados/total/votos",
                {
                    dignidad_id,
                    provincia_id,
                    canton_id,
                    parroquia_id,
                }
            );
            if (data.msg) {
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                    dispatch(onClearResultados());
                }, 40);
            } else {
                const { totalDeVotos } = data;
                dispatch(onLoadTotalDeVotos(totalDeVotos));
            }
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };


    const startLoadTotalActasIngresadas = async ({
        dignidad_id,
        provincia_id,
        canton_id = null,
        parroquia_id = null,
    }) => {
        try {
            const { data } = await apiAxios.post("/admin/actas/ingresadas", {
                dignidad_id,
                provincia_id,
                canton_id,
                parroquia_id,
            });
            const { totalActasIngresadas } = data;
            dispatch(onLoadTotalIngresadas(totalActasIngresadas));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadTotalActasIngresadasMapa = async ({
        dignidad_id,
        provincia_id,
        canton_id = null,
        parroquia_id = null,
    }) => {
        try {
            const { data } = await apiAxios.post("/actas/ingresadas", {
                dignidad_id,
                provincia_id,
                canton_id,
                parroquia_id,
            });
            const { totalActasIngresadas } = data;
            dispatch(onLoadTotalIngresadas(totalActasIngresadas));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadTotalJuntas = async ({
        provincia_id,
        canton_id = null,
        parroquia_id = null,
    }) => {
        try {
            const { data } = await apiAxios.post("/general/total/juntas", {
                provincia_id,
                canton_id,
                parroquia_id,
            });
            const { totalJuntas } = data;
            dispatch(onLoadTotalJuntas(totalJuntas));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };


    const startLoadTotalJuntasMapa = async ({
        provincia_id,
        canton_id = null,
        parroquia_id = null,
    }) => {
        try {
            const { data } = await apiAxios.post("/total/juntas", {
                provincia_id,
                canton_id,
                parroquia_id,
            });
            const { totalJuntas } = data;
            dispatch(onLoadTotalJuntas(totalJuntas));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadResultadosCandidatos = async ({
        dignidad_id,
        provincia_id = null,
        canton_id = null,
        parroquia_id = null,
        recinto_id = null,
        cuadrada = null,
        legible = null,
    }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/admin/resultados/totales", {
                dignidad_id,
                provincia_id,
                canton_id,
                parroquia_id,
                recinto_id,
                cuadrada,
                legible,
            });
            const { candidatos } = data;
            candidatos.length === 0
                ? dispatch(onClearResultados())
                : dispatch(onLoadResultadosCandidatos(candidatos));
        } catch (error) {
            //console.log(error);
            dispatch(onClearResultados());
            ExceptionMessageError(error);
        }
    };

    const startClearResultadosMap = () => {
        dispatch(onClearResultadosMap());
    };

    const startClearResultados = () => {
        dispatch(onClearResultados());
    };

    /* Hooks para el MAPA */
    const startLoadTotalDeVotosGuess = async ({
        dignidad_id,
        provincia_id,
        canton_id = null,
        parroquia_id = null,
    }) => {
        try {
            const { data } = await apiAxios.post("/resultados/total/votos", {
                dignidad_id,
                provincia_id,
                canton_id,
                parroquia_id,
            });
            if (data.msg) {
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                    dispatch(onClearResultados());
                }, 40);
            } else {
                const { totalDeVotos } = data;
                dispatch(onLoadTotalDeVotos(totalDeVotos));
            }
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadResultadosCandidatosGuess = async ({
        dignidad_id,
        provincia_id = null,
        canton_id = null,
        parroquia_id = null,
        recinto_id = null,
        cuadrada = null,
        legible = null,
    }) => {
        try {
            const { data } = await apiAxios.post("/resultados/totales", {
                dignidad_id,
                provincia_id,
                canton_id,
                parroquia_id,
                recinto_id,
                cuadrada,
                legible,
            });
            const { candidatos } = data;
            candidatos.length === 0
                ? dispatch(onClearResultados())
                : dispatch(onLoadResultadosCandidatos(candidatos));
        } catch (error) {
            //console.log(error);
            dispatch(onClearResultados());
            ExceptionMessageError(error);
        }
    };

    const startLoadResultadosForMap = async (dignidad_id) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/resultados-cantones", {
                dignidad_id,
            });
            const { resultados } = data;
            dispatch(onLoadResultadosForMap(resultados));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadResultadosForMapZonas = async (dignidad_id) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/resultados-zonas", {
                dignidad_id,
            });
            const { resultados } = data;
            dispatch(onLoadResultadosForMap(resultados));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startSendWhatsApp = async (values) => {
        try {
            dispatch(onSending(true));
            const { data } = await apiAxios.post(
                "/admin/resultados/send-whatsapp",
                values
            );
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
            dispatch(onSending(false));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    /* EXportaciones PDF */
    const startExportResultadosPDF = async (dignidad_id, resultados, totalDeVotos) => {
        try {
            onExport(true);
            const response = await apiAxios.post(
                "/admin/resultados/export-pdf",
                {
                    dignidad_id,
                    resultados,
                    totalDeVotos
                },
                { responseType: "blob" }
            );
            const pdfBlob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.open(URL.createObjectURL(pdfBlob));
            window.URL.revokeObjectURL(url);
            dispatch(onExport(false));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startExportResultadosPDFZonas = async (dignidad_id, resultados, totalDeVotos) => {
        try {
            onExport(true);
            const response = await apiAxios.post(
                "/admin/resultados/export-pdf/zonas",
                {
                    dignidad_id,
                    resultados,
                    totalDeVotos
                },
                { responseType: "blob" }
            );
            const pdfBlob = new Blob([response.data], {
                type: "application/pdf",
            });
            const url = window.open(URL.createObjectURL(pdfBlob));
            window.URL.revokeObjectURL(url);
            dispatch(onExport(false));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    /* Exportacion Excel XLS */
    const startExportResultadosXLS = async (dignidad_id) => {
        try {
            onExport(true);
            const response = await apiAxios.post(
                "/admin/resultados/export-xls",
                {
                    dignidad_id,
                },
                { responseType: "blob" }
            );
            const url = window.URL.createObjectURL(
                new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
                })
            );
            window.open(url, "_blank");
            dispatch(onExport(false));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    }

    return {
        pageLoad,
        isLoading,
        isSendingWhats,
        isExport,
        totalDeVotos,
        totalActasIngresadas,
        totalJuntas,
        resultadoCandidatos,
        resultadosForMap,
        message,
        errores,

        startLoadTotalDeVotos,
        startLoadTotalDeVotosGuess,
        startLoadTotalActasIngresadas,
        startLoadTotalJuntas,
        startLoadResultadosCandidatos,
        startLoadResultadosCandidatosGuess,
        startLoadResultadosForMap,
        startLoadResultadosForMapZonas,
        startSendWhatsApp,
        startExportResultadosPDF,
        startExportResultadosPDFZonas,
        startClearResultados,
        startClearResultadosMap,
        startLoadTotalActasIngresadasMapa,
        startLoadTotalJuntasMapa,
        startExportResultadosXLS
    };
};
