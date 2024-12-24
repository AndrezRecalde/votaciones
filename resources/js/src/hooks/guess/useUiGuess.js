import { useDispatch, useSelector } from "react-redux";
import { onOpenModalGuess, onOpenModalStatusGuess } from "../../store/admin/guess/uiGuessSlice";

export const useUiGuess = () => {
    const { isOpenModalGuess, isOpenModalStatusGuess } = useSelector(
        (state) => state.uiGuess
    );

    const dispatch = useDispatch();

    const modalActionGuess = (behavior = false) => {
        dispatch(onOpenModalGuess(behavior));
    }

    const modalActionStatusGuess = (behavior = false) => {
        dispatch(onOpenModalStatusGuess(behavior));
    }

    return {
        isOpenModalGuess,
        isOpenModalStatusGuess,

        modalActionGuess,
        modalActionStatusGuess
    };
};
