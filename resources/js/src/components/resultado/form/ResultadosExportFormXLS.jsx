import { Box, Divider, Select, Stack } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { IconDownload } from "@tabler/icons-react";
import { useDignidadStore, useResultadoStore, useUiResultado } from "../../../hooks";

export const ResultadosExportFormXLS = ({ form }) => {
    const { dignidad_id } = form.values;
    const { dignidades } = useDignidadStore();
    const { modalActionResultadosExportXLS } = useUiResultado();
    const { startExportResultadosXLS } = useResultadoStore();


    const handleSubmit = (e) => {
        e.preventDefault();
        startExportResultadosXLS(form.getTransformedValues());
        modalActionResultadosExportXLS(false);
        form.reset();
    }

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Divider my="xs" />
            <Stack>
                <Select
                    label="Dignidad"
                    placeholder="Seleccione la dignidad"
                    searchable
                    withAsterisk
                    nothingFoundMessage="No options"
                    {...form.getInputProps("dignidad_id")}
                    data={dignidades.map((dignidad) => {
                        return {
                            label: dignidad.nombre_dignidad,
                            value: dignidad.id.toString(),
                        };
                    })}
                />
                <BtnSubmit IconSection={IconDownload}>Descargar datos</BtnSubmit>
            </Stack>
        </Box>
    );
};
