import { useDispatch, useSelector } from "react-redux";
import { useErrorException } from "../error/useErrorException";
import { onClearDistritos, onLoadDistritos, onLoadErrores, onLoading } from "../../store/admin/jurisdiccion/distrito/distritoSlice";
import apiAxios from "../../api/apiAxios";

export const useDistritoStore = () => {
    const { isLoading, distritos, activateDistrito, message, errores } =
        useSelector((state) => state.distrito);

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadDistritos = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/distritos");
            const { distritos } = data;
            dispatch(onLoadDistritos(distritos));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    }

    const startClearDistritos = () => {
        dispatch(onClearDistritos());
    }

    return {
        isLoading,
        distritos,
        activateDistrito,
        message,
        errores,

        startLoadDistritos,
        startClearDistritos
    };
};
