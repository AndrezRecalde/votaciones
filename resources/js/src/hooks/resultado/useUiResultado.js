import { useDispatch, useSelector } from "react-redux";
import { onOpenModalResultados, onOpenModalWhatsApp } from "../../store/resultados/uiResultadosSlice";

export const useUiResultado = () => {
    const { isOpenModalWhatsApp, isOpenModalResultados } = useSelector((state) => state.uiResultados);
    const dispatch = useDispatch();

    const modalActionWhatsApp = (behavior = false) => {
        dispatch(onOpenModalWhatsApp(behavior));
    };

    const modalActionResultadosExport = (behavior = false) => {
        dispatch(onOpenModalResultados(behavior));
    }

    return {
        isOpenModalWhatsApp,
        isOpenModalResultados,


        modalActionWhatsApp,
        modalActionResultadosExport
    };
};
