import { useDispatch, useSelector } from "react-redux";
import {
    onOpenModalResultados,
    onOpenModalResultadosXLS,
    onOpenModalWhatsApp,
} from "../../store/resultados/uiResultadosSlice";

export const useUiResultado = () => {
    const {
        isOpenModalWhatsApp,
        isOpenModalResultados,
        isOpenModalResultadosXLS,
    } = useSelector((state) => state.uiResultados);
    const dispatch = useDispatch();

    const modalActionWhatsApp = (behavior = false) => {
        dispatch(onOpenModalWhatsApp(behavior));
    };

    const modalActionResultadosExport = (behavior = false) => {
        dispatch(onOpenModalResultados(behavior));
    };

    const modalActionResultadosExportXLS = (behavior = false) => {
        dispatch(onOpenModalResultadosXLS(behavior));
    };

    return {
        isOpenModalWhatsApp,
        isOpenModalResultados,
        isOpenModalResultadosXLS,

        modalActionWhatsApp,
        modalActionResultadosExport,
        modalActionResultadosExportXLS
    };
};
