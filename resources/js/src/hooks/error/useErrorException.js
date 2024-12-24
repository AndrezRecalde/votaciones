import { useDispatch } from 'react-redux'

export const useErrorException = (onErrores) => {

    const dispatch = useDispatch();

    const ExceptionMessageError = (error) => {
        const mensaje = error.response.data.msg
            ? error.response.data.msg
            : error.response.data.errores
            ? Object.values(error.response.data.errores)
            : error.response.data.message
            ? error.response.data.message
            : error;
        dispatch(onErrores(mensaje));
        setTimeout(() => {
            dispatch(onErrores(undefined));
        }, 40);
    };

  return {
    ExceptionMessageError
  }
}
