import { useDispatch, useSelector } from "react-redux";
import { onOpenModalRegisterUser } from "../../store/auth/uiAuthSlice";

export const useUiAuth = () => {
    const { isOpenModalRegisterUser } = useSelector((state) => state.uiAuth);
    const dispatch = useDispatch();

    const modalActionRegisterUser = (behavior = false) => {
        dispatch(onOpenModalRegisterUser(behavior));
    };

    return {
        isOpenModalRegisterUser,

        modalActionRegisterUser
    };
};
