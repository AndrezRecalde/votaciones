import { useDispatch, useSelector } from "react-redux"
import { useErrorException } from "../error/useErrorException";
import { onClearRoles, onLoadErrores, onLoading, onLoadRoles } from "../../store/admin/role/roleSlice";
import apiAxios from "../../api/apiAxios";

export const useRoleStore = () => {

  const { roles } = useSelector(state => state.role);

  const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadRoles = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get('/admin/roles');
            const { roles } = data;
            dispatch(onLoadRoles(roles));
        } catch (error) {
            //console.log(error);
            ExceptionMessageError(error);
        }
    }

    const startClearRoles = () => {
        dispatch(onClearRoles());
    }

  return {
    roles,

    startLoadRoles,
    startClearRoles
  }
}
