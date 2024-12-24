import { useDispatch, useSelector } from "react-redux";
import {
    onClearGuesses,
    onDeleteGuess,
    onLoadErrores,
    onLoadGuesses,
    onLoading,
    onLoadMessage,
    onSetActivateGuess,
} from "../../store/admin/guess/guessSlice";
import { useErrorException } from "../error/useErrorException";
import apiAxios from "../../api/apiAxios";

export const useGuessStore = () => {
    const { isLoading, guesses, activateGuess, message, errores } = useSelector(
        (state) => state.guess
    );

    const dispatch = useDispatch();

    const { ExceptionMessageError } = useErrorException(onLoadErrores);

    const startLoadGuess = async () => {
        try {
            dispatch(onLoading(true));
            const { data } = await apiAxios.get("/admin/guesses");
            const { guesses } = data;
            dispatch(onLoadGuesses(guesses));
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startAddGuess = async (guess) => {
        try {
            if (guess.id) {
                const { data } = await apiAxios.put(
                    `/admin/update/guess/${guess.id}`,
                    guess
                );
                startLoadGuess();
                dispatch(onLoadMessage(data));
                setTimeout(() => {
                    dispatch(onLoadMessage(undefined));
                }, 40);
                return;
            }
            const { data } = await apiAxios.post("/admin/store/guess", guess);
            startLoadGuess();
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startDeleteGuess = async (guess) => {
        try {
            const { data } = await apiAxios.delete(
                `/admin/delete/guess/${guess.id}`
            );
            dispatch(onDeleteGuess());
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const startUpdateActivo = async (guess) => {
        try {
            const { data } = await apiAxios.put(
                `/admin/update/status/guess/${guess.id}`,
                guess
            );
            startLoadGuess();
            dispatch(onLoadMessage(data));
            setTimeout(() => {
                dispatch(onLoadMessage(undefined));
            }, 40);
        } catch (error) {
            console.log(error);
            ExceptionMessageError(error);
        }
    };

    const setActivateGuess = (guess) => {
        dispatch(onSetActivateGuess(guess));
    };

    const startClearGuess = () => {
        dispatch(onClearGuesses());
    };

    return {
        isLoading,
        guesses,
        activateGuess,
        message,
        errores,

        startLoadGuess,
        startAddGuess,
        startDeleteGuess,
        startUpdateActivo,
        setActivateGuess,
        startClearGuess
    };
};
