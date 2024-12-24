import { useDispatch, useSelector } from "react-redux";
import { onOpenModalStatusDignidad } from "../../store/admin/dignidad/uiDignidadSlice";

export const useUiDignidad = () => {
    const { isOpenModalStatusDignidad } = useSelector(
        (state) => state.uiDistrito
    );
    const dispatch = useDispatch();

    const modalActionStatusDignidad = (behavior = false) => {
        dispatch(onOpenModalStatusDignidad(behavior));
    }

  return {
    isOpenModalStatusDignidad,

    modalActionStatusDignidad
  }
}
