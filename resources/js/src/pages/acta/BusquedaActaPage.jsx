import { useEffect } from "react";
import { Box, Button, Container, Divider, Group, LoadingOverlay } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    BusquedaActaForm,
    BusquedaActaTable,
    TitlePage,
} from "../../components";
import {
    useActaStore,
    useDignidadStore,
    useJurisdiccionStore,
    useTitleHook,
} from "../../hooks";
import { IconFileTypeXls } from "@tabler/icons-react";

const BusquedaActaPage = () => {
    useTitleHook("Elecciones | Busq. Actas");
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { startLoadDignidades } = useDignidadStore();
    const { startLoadCantones, startClearJurisdicciones } =
        useJurisdiccionStore();
    const { isLoading, pageLoad, startExportExcelActas } = useActaStore();

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
            tipo_acta: values.tipo_acta !== "" ? Number(values.tipo_acta) : null,
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
        <Container size="xxl">
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
            <BusquedaActaForm form={form} />
            <LoadingOverlay
                visible={isLoading}
                zIndex={500}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            {pageLoad ? (
                <Box mt={50}>
                    <BusquedaActaTable />
                </Box>
            ) : null}
        </Container>
    );
};

export default BusquedaActaPage;
