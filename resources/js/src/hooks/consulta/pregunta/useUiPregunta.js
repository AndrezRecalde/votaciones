import { useDispatch, useSelector } from "react-redux";
import {
    onOpenModalPregunta,
    onOpenModalStatusPregunta,
} from "../../../store/consulta/pregunta/uiPreguntaSlice";

export const useUiPregunta = () => {
    const { isOpenModalPregunta, isOpenModalStatusPregunta } = useSelector(
        (state) => state.uiPregunta
    );

    const dispatch = useDispatch();

    const modalActionPregunta = (behavior = false) => {
        dispatch(onOpenModalPregunta(behavior));
    };

    const modalActionStatusPregunta = (behavior = false) => {
        dispatch(onOpenModalStatusPregunta(behavior));
    };

    return {
        isOpenModalPregunta,
        isOpenModalStatusPregunta,

        modalActionPregunta,
        modalActionStatusPregunta,
    };
};
