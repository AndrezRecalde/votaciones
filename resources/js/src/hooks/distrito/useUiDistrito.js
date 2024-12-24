import { useDispatch, useSelector } from "react-redux";
import {
    onOpenModalDistrito,
    onOpenModalStatusDistrito,
} from "../../store/admin/jurisdiccion/distrito/uiDistritoSlice";

export const useUiDistrito = () => {
    const { isOpenModalDistrito, isOpenModalStatusDistrito } = useSelector(
        (state) => state.uiDistrito
    );
    const dispatch = useDispatch();

    const modalActionDistrito = (behavior = false) => {
        dispatch(onOpenModalDistrito(behavior));
    };

    const modalActionStatusDistrito = (behavior = false) => {
        dispatch(onOpenModalStatusDistrito(behavior));
    };

    return {
        isOpenModalDistrito,
        isOpenModalStatusDistrito,

        modalActionDistrito,
        modalActionStatusDistrito,
    };
};
