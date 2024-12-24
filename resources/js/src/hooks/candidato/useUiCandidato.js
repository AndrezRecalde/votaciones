import { useDispatch, useSelector } from "react-redux";
import {
    onOpenModalCandidato,
    onOpenModalStatusCandidato,
} from "../../store/admin/candidato/uiCandidatoSlice";

export const useUiCandidato = () => {
    const { isOpenModalCandidato, isOpenModalStatusCandidato } = useSelector(
        (state) => state.uiCandidato
    );

    const dispatch = useDispatch();

    const modalActionCandidato = (behavior = false) => {
        dispatch(onOpenModalCandidato(behavior));
    };

    const modalActionStatusCandidato = (behavior = false) => {
        dispatch(onOpenModalStatusCandidato(behavior));
    };

    return {
        isOpenModalCandidato,
        isOpenModalStatusCandidato,

        modalActionCandidato,
        modalActionStatusCandidato
    };
};
