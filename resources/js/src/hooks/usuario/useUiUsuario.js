import { useDispatch, useSelector } from "react-redux";
import {
    onOpenModalPassword,
    onOpenModalStatusUsuario,
    onOpenModalUsuario,
} from "../../store/admin/usuario/uiUsuarioSlice";

export const useUiUsuario = () => {
    const {
        isOpenModalUsuario,
        isOpenModalStatusUsuario,
        isOpenModalPassword,
    } = useSelector((state) => state.uiUsuario);

    const dispatch = useDispatch();

    const modalActionUsuario = (behavior = false) => {
        dispatch(onOpenModalUsuario(behavior));
    };

    const modalActionStatusUsuario = (behavior = false) => {
        dispatch(onOpenModalStatusUsuario(behavior));
    };

    const modalActionPwdUsuario = (behavior = false) => {
        dispatch(onOpenModalPassword(behavior));
    };

    return {
        isOpenModalUsuario,
        isOpenModalStatusUsuario,
        isOpenModalPassword,

        modalActionUsuario,
        modalActionStatusUsuario,
        modalActionPwdUsuario,
    };
};
