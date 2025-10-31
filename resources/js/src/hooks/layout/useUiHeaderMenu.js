import { useDispatch, useSelector } from "react-redux";
import {
    onOpenDrawerMobile,
    onOpenMenuLinksAdmin,
    onOpenMenuLinksResultados,
} from "../../store/app/uiHeaderMenuSlice";

export const useUiHeaderMenu = () => {
    const {
        isOpenDrawerMobile,
        isOpenMenuLinksAdmin,
        isOpenMenuLinksResultados,
    } = useSelector((state) => state.uiHeaderMenu);
    const dispatch = useDispatch();

    const modalActionDrawerMobile = (behavior = false) => {
        dispatch(onOpenDrawerMobile(behavior));
    };

    const modalMenuLinksAdmin = (behavior = false) => {
        dispatch(onOpenMenuLinksAdmin(behavior));
    };

    const modalMenuLinksResultados = (behavior = false) => {
        dispatch(onOpenMenuLinksResultados(behavior));
    };

    return {
        isOpenDrawerMobile,
        isOpenMenuLinksAdmin,
        isOpenMenuLinksResultados,

        modalActionDrawerMobile,
        modalMenuLinksAdmin,
        modalMenuLinksResultados,
    };
};
