import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import { onLoadErrores } from "../../store/admin/jurisdiccion/junta/juntaSlice";
import {
    onClearJurisdicciones,
    onLoadCantones,
    onLoading,
    onLoadJuntas,
    onLoadParroquias,
    onLoadProvincias,
    onLoadRecintos,
    onLoadZonas,
} from "../../store/admin/jurisdiccion/jurisdiccionSlice";
import apiAxios from "../../api/apiAxios";

export const useJurisdiccionStore = () => {
    const {
        isLoading,
        provincias,
        cantones,
        parroquias,
        recintos,
        zonas,
        juntas,
        message,
        errores,
    } = useSelector((state) => state.jurisdiccion);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadProvincias = async ({
        provincia_id = null,
        activo = null,
    }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/listar/provincias", {
                provincia_id,
                activo,
            });
            const { provincias } = data;
            dispatch(onLoadProvincias(provincias));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadCantones = async ({ provincia_id = null }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/cantones", {
                provincia_id,
            });
            const { cantones } = data;
            dispatch(onLoadCantones(cantones));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadCantonesGuess = async ({ provincia_id = null }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/cantones", {
                provincia_id,
            });
            const { cantones } = data;
            dispatch(onLoadCantones(cantones));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadParroquias = async ({ canton_id = null }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/parroquias", {
                canton_id,
            });
            const { parroquias } = data;
            dispatch(onLoadParroquias(parroquias));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadRecintos = async ({ parroquia_id = null }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/recintos", {
                parroquia_id,
            });
            const { recintos } = data;
            dispatch(onLoadRecintos(recintos));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadZonas = async ({ parroquia_id = null }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/zonas", {
                parroquia_id,
            });
            const { zonas } = data;
            dispatch(onLoadZonas(zonas));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startLoadJuntas = async ({ zona_id = null }) => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.post("/general/juntas", {
                zona_id,
            });
            const { juntas } = data;
            dispatch(onLoadJuntas(juntas));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startClearJurisdicciones = () => {
        dispatch(onClearJurisdicciones());
    };

    return {
        isLoading,
        provincias,
        cantones,
        parroquias,
        recintos,
        zonas,
        juntas,
        message,
        errores,

        startLoadProvincias,
        startLoadCantones,
        startLoadCantonesGuess,
        startLoadParroquias,
        startLoadRecintos,
        startLoadZonas,
        startLoadJuntas,
        startClearJurisdicciones,
    };
};
