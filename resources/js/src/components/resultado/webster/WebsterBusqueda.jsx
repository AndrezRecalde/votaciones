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
    const { startLoadCantones, startLoadParroquias, startLoadZonas } =
        useJurisdiccionStore();

    const form = useForm({
        initialValues: {
            dignidad_id: dig.toString(),
            canton_id: null,
            parroquia_id: null,
            zona_id: null,
            cuadrada: "",
            legible: "",
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || 0,
            canton_id: Number(values.canton_id) || 0,
            parroquia_id: Number(values.parroquia_id) || 0,
            zona_id: Number(values.zona_id) || 0,
        }),
    });

    const { canton_id, parroquia_id } = form.values;

    useEffect(() => {
        return () => {
            startClearDignidades();
        };
    }, []);

    useEffect(() => {
        startLoadDignidades({ activo: true, tipo: "W" });
        startLoadCantones({ provincia_id: usuario?.provincia_id });
    }, []);

    useEffect(() => {
        startLoadParroquias({ canton_id });
        form.setFieldValue("parroquia_id", null);
    }, [canton_id]);

    useEffect(() => {
        startLoadZonas({ parroquia_id });
        form.setFieldValue("zona_id", null);
    }, [parroquia_id]);

    return (
        <Card withBorder shadow="sm" radius="md" mt={20}>
            <WebsterBusquedaForm form={form} />
        </Card>
    );
};
