import { useCallback } from "react";

export const useFechaStore = () => {
    const fechaActual = useCallback(() => {
        let hoy = new Date();
        return hoy.toLocaleString();
    }, []);

    return { fechaActual };
};
