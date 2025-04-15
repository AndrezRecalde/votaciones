import { Box, Drawer, Grid, LoadingOverlay } from "@mantine/core";
import {
    MapBusquedaForm,
    StatEscrutinio,
    StatVocacion,
    TableResultado,
    WebsterEscanioTable,
} from "../..";
import { isNotEmpty, useForm } from "@mantine/form";
import { useResultadoStore } from "../../../hooks";

export const MapResultadosDrawer = () => {
    const { isLoading, pageLoad } = useResultadoStore();
    const form = useForm({
        initialValues: {
            //canton_id: null,
            dignidad_id: null,
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor seleccione una dignidad"),
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || null,
            //canton_id: Number(values.canton_id) || null,
        }),
    });

    const { dignidad_id } = form.values;

    return (
        <Drawer
            opened={true}
            position="right"
            size="xl"
            closeOnClickOutside={false}
            closeOnEscape={false}
            withCloseButton={false}
            withOverlay={false}
            withinPortal={false}
            title="Filtros"
        >
            <MapBusquedaForm form={form} />
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            {pageLoad && dignidad_id == 1 ? (
                <Box>
                    <TableResultado />
                    <Grid>
                        <Grid.Col span={{ base: 1, xs: 1, md: 5, lg: 5, xl: 5 }}>
                            <StatVocacion />
                        </Grid.Col>
                        <Grid.Col span={{ base: 1, xs: 1, md: 7, lg: 7, xl: 7 }}>
                            <StatEscrutinio />
                        </Grid.Col>
                    </Grid>
                </Box>
            ) : pageLoad && (dignidad_id == 2 || dignidad_id == 3) ? (
                <Box>
                    <WebsterEscanioTable />
                    <StatEscrutinio />
                </Box>
            ) : null}
        </Drawer>
    );
};
