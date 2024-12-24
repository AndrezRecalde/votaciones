import { Box, Drawer } from "@mantine/core";
import { MapBusquedaForm, StatVocacion, TableResultado, WebsterEscanioTable } from "../..";
import { isNotEmpty, useForm } from "@mantine/form";
import { useResultadoStore } from "../../../hooks";

export const MapResultadosDrawer = () => {
    const { pageLoad } = useResultadoStore();
    const form = useForm({
        initialValues: {
            //canton_id: null,
            dignidad_id: null,
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor seleccione una dignidad")
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

            {pageLoad && dignidad_id == 1 ? (
                <Box>
                    <TableResultado />
                    <StatVocacion />
                </Box>
                ) : pageLoad && (dignidad_id == 2 || dignidad_id == 3) ? (
                    <WebsterEscanioTable />
                ): null}
        </Drawer>
    );
};
