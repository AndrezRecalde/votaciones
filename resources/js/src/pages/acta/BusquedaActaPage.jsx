import { useEffect } from "react";
import { Box, Button, Container, Group } from "@mantine/core";
import { BusquedaActaForm, BusquedaActaTable, TitlePage } from "../../components";
import { useActaStore, useDignidadStore, useJurisdiccionStore } from "../../hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconFileTypeXls } from "@tabler/icons-react";

const BusquedaActaPage = () => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { startLoadDignidades } = useDignidadStore();
    const { startLoadCantones, startClearJurisdicciones } =
        useJurisdiccionStore();
    const { pageLoad, startExportExcelActas } = useActaStore();

    const form = useForm({
        initialValues: {
            dignidad_id: null,
            canton_id: null,
            parroquia_id: null,
            tipo_acta: "",
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor ingrese la dignidad"),
        },
        transformValues: (values) => ({
            ...values,
            dignidad_id: Number(values.dignidad_id) || null,
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
        }),
    });

    useEffect(() => {
        startLoadDignidades({ activo: true });
        return () => {
            startClearJurisdicciones();
        };
    }, []);

    useEffect(() => {
        startLoadCantones({ provincia_id: usuario.provincia_id });
    }, []);

    const handleExportExcel = (e) => {
        e.preventDefault();
        const { errors } = form.validate();
        if (!errors.hasOwnProperty("dignidad_id")) {
            startExportExcelActas(form.getTransformedValues());
        }
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
            <BusquedaActaForm form={form} />
            {
                pageLoad ? (
                    <Box mt={50}>
                        <BusquedaActaTable />
                    </Box>
                ) : null
            }
        </Container>
    );
};

export default BusquedaActaPage;