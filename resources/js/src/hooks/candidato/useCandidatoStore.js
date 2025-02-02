import { useDispatch, useSelector } from "react-redux";
import {
    onClearCandidatos,
    onDeleteCandidato,
    onLoadCandidatos,
    onLoadErrores,
    onLoading,
    onLoadMessage,
    onSetActivateCandidato,
} from "../../store/admin/candidato/candidatoSlice";
import { useErrorException } from "../error/useErrorException";
import apiAxios from "../../api/apiAxios";

export const useCandidatoStore = () => {
    const { isLoading, candidatos, activateCandidato, message, errores } =
        useSelector((state) => state.candidato);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadCandidatos = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/candidatos");
            const { candidatos } = data;
            dispatch(onLoadCandidatos(candidatos));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startAddCandidatos = async (candidato) => {
        try {
            if (candidato.id) {
                const { data } = await apiAxios.put(
                    `/admin/update/candidato/${candidato.id}`,
                    candidato
                );
                startLoadCandidatos();
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                }, 40);
                return;
            }
            const { data } = await apiAxios.post(
                "/admin/store/candidato",
                candidato
            );
            startLoadCandidatos();
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startDeleteCandidato = async (candidato) => {
        try {
            const { data } = await apiAxios.delete(`/admin/delete/candidato/${candidato.id}`);
            dispatch(onDeleteCandidato());
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    }

    const startUpdateActivo = async (candidato) => {
        try {
            const { data } = await apiAxios.put(
                `/admin/update/status/candidato/${candidato.id}`,
                candidato
            );
            startLoadCandidatos();
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    };

    const setActivateCandidato = (candidato) => {
        dispatch(onSetActivateCandidato(candidato));
    }

    const startClearCandidatos = () => {
        dispatch(onClearCandidatos());
    }

    return {
        isLoading,
        candidatos,
        activateCandidato,
        message,
        errores,

        startLoadCandidatos,
        startAddCandidatos,
        startDeleteCandidato,
        startUpdateActivo,
        setActivateCandidato,
        startClearCandidatos
    };
};
