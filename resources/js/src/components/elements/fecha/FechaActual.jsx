import { useFechaStore } from "../../../hooks";
import { BadgeElement } from "../badge/BadgeElement";

export const FechaActual = () => {
    const { fechaActual } = useFechaStore();

    return (
        <BadgeElement variant="default">
            {`Fecha & Hora del reporte: ${fechaActual()}`}
        </BadgeElement>
    );
};
