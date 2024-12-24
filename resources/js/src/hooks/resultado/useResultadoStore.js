import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import {
    onClearResultados,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onLoadResultadosCandidatos,
    onLoadResultadosForMap,
    onLoadTotalDeVotos,
    onLoadTotalIngresadas,
    onLoadTotalJuntas,
} from "../../store/resultados/resultadosSlice";
import apiAxios from "../../api/apiAxios";

export const useResultadoStore = () => {
    const {
        pageLoad,
        isLoading,
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
            dispatch(onClearResultados());
            ExceptionMessageError(error);
        }
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
            console.log(error);
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
            console.log(error);
            dispatch(onClearResultados());
            ExceptionMessageError(error);
        }
    };

    const startLoadResultadosForMap = async (dignidad_id) => {
        try {
            const { data } = await apiAxios.post("/resultados-cantones", {
                dignidad_id
            });
            const { resultados } = data;
            dispatch(onLoadResultadosForMap(resultados));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };



    return {
        pageLoad,
        isLoading,
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
        startClearResultados,
    };
};
