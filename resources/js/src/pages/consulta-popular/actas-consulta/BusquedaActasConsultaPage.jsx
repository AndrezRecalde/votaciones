import { Box, Button, Container, Divider, Group } from "@mantine/core";
import {
    BusquedaActasConsultaFilter,
    BusquedaActasConsultaTable,
    TitlePage,
} from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useActaConsultaStore, useJurisdiccionStore } from "../../../hooks";
import { useEffect } from "react";
import { IconFileTypeXls } from "@tabler/icons-react";

const BusquedaActasConsultaPage = () => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { startLoadCantones, startClearJurisdicciones } =
        useJurisdiccionStore();
    const { loadingActaConsulta, startClearActaConsulta } = useActaConsultaStore();

    const form = useForm({
        initialValues: {
            canton_id: null,
            parroquia_id: null,
            zona_id: null,
            tipo_acta: "",
        },
        validate: {
            canton_id: isNotEmpty("Por favor ingrese el cantón"),
        },
        transformValues: (values) => ({
            ...values,
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
            zona_id: Number(values.zona_id) || null,
            tipo_acta:
                values.tipo_acta !== "" ? Number(values.tipo_acta) : null,
        }),
    });

    useEffect(() => {
        startLoadCantones({ provincia_id: usuario.provincia_id });

        return () => {
            startClearJurisdicciones();
            startClearActaConsulta();
        };
    }, []);

    const handleExportExcel = (e) => {
        e.preventDefault();
    };

    return (
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={2}>Búsqueda de Actas</TitlePage>
                <Button
                    onClick={(e) => handleExportExcel(e)}
                    leftSection={<IconFileTypeXls size={14} />}
                    variant="default"
                >
                    Exportar
                </Button>
            </Group>
            <Divider my="md" />
            <BusquedaActasConsultaFilter form={form} />
            {loadingActaConsulta ? (
                <Box mt={50}>
                    <BusquedaActasConsultaTable />
                </Box>
            ) : null}
        </Container>
    );
};

export default BusquedaActasConsultaPage;
