import { useDispatch, useSelector } from "react-redux";
import { onClearStorage, onStorageFields } from "../../store/storage/storageSlice";

export const useStorageStore = () => {
    const { selectedFields } = useSelector((state) => state.storage);
    const dispatch = useDispatch();

    const setStorageFields = (fields) => {
        dispatch(onStorageFields(fields));
    };

    const startClearStorage = () => {
        dispatch(onClearStorage());
    }

    return {
        selectedFields,

        setStorageFields,
        startClearStorage
    };
};
