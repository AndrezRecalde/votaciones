import { useEffect, useMemo } from "react";
import { Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDignidadStore, useJurisdiccionStore } from "../../../hooks";
import { WebsterBusquedaForm } from "../../../components";

export const WebsterBusqueda = ({ dig }) => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const { startLoadDignidades, startClearDignidades } = useDignidadStore();
    const { startLoadCantones } = useJurisdiccionStore();

    const form = useForm({
        initialValues: {
            dignidad_id: dig.toString(),
            canton_id: null,
            cuadrada: "",
            legible: "",
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || 0,
            canton_id: Number(values.canton_id) || 0,
        }),
    });

    useEffect(() => {
        startLoadDignidades({ activo: true, tipo: "W" });
        startLoadCantones({ provincia_id: usuario?.provincia_id });

        return () => {
            startClearDignidades();
        };
    }, []);

    return (
        <Card withBorder shadow="sm" radius="md" mt={20}>
            <WebsterBusquedaForm form={form} />
        </Card>
    );
};
