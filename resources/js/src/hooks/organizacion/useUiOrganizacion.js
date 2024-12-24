import { useDispatch, useSelector } from "react-redux"
import { onOpenModalAddOrganizacion } from "../../store/admin/organizacion/uiOrganizacionSlice";

export const useUiOrganizacion = () => {
 const { isOpenModalOrganizacion } = useSelector(state => state.uiOrganizacion);
 const dispatch = useDispatch();

 const modalActionOrganizacion = (behavior = false) => {
    dispatch(onOpenModalAddOrganizacion(behavior));
 }

  return {
    isOpenModalOrganizacion,

    modalActionOrganizacion
  }
}
