import { useDispatch, useSelector } from "react-redux";
import {
    onOpenDrawerMobile,
    onOpenMenuLinksTics,
} from "../../store/app/uiHeaderMenuSlice";

export const useUiHeaderMenu = () => {
    const {
        isOpenDrawerMobile,
        isOpenMenuLinksTics,
    } = useSelector((state) => state.uiHeaderMenu);
    const dispatch = useDispatch();


    const modalActionDrawerMobile = (behavior = false) => {
        dispatch(onOpenDrawerMobile(behavior));
    };

    const modalMenuLinksTics = (behavior = false) => {
        dispatch(onOpenMenuLinksTics(behavior));
    }


    return {
        isOpenDrawerMobile,
        isOpenMenuLinksTics,

        modalActionDrawerMobile,
        modalMenuLinksTics,
    };
};
