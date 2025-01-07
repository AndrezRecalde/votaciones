import {
    ActionIcon,
    Box,
    Divider,
    Group,
    rem,
    Select,
    Stack,
} from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import {
    useDignidadStore,
    useResultadoStore,
    useUiResultado,
} from "../../../hooks";
import { IconDownload, IconRotate2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const ResultadosExportForm = ({ form }) => {
    const { dignidad_id } = form.values;
    const [disabled, setDisabled] = useState(true);
    const { dignidades } = useDignidadStore();
    const { modalActionResultadosExport } = useUiResultado();
    const {
        resultadosForMap,
        totalDeVotos,
        startLoadResultadosForMap,
        startLoadTotalDeVotosGuess,
        startExportResultadosPDF,
        startClearResultadosMap
    } = useResultadoStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getTransformedValues());
        startLoadTotalDeVotosGuess({
            dignidad_id,
            provincia_id: 8,
        });
        startLoadResultadosForMap(dignidad_id);
    };

    useEffect(() => {
        if (resultadosForMap.length !== 0) {
            setDisabled(false);
            return;
        }
    }, [resultadosForMap]);

    const handleExportPDF = (e) => {
        e.preventDefault();
        console.log(dignidad_id, resultadosForMap, totalDeVotos);
        startExportResultadosPDF(dignidad_id, resultadosForMap, totalDeVotos);
        modalActionResultadosExport(false);
        startClearResultadosMap();
    };

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
                {resultadosForMap.length !== 0 ? (
                    <Group justify="center">
                        <TextSection fw={600} fz={12}>
                            ¡Los datos se han cargado exitosamente!
                        </TextSection>

                        <ActionIcon
                            disabled={disabled}
                            size={50}
                            variant="default"
                            aria-label="ActionIcon with size as a number"
                            onClick={handleExportPDF}
                        >
                            <IconDownload
                                style={{ width: rem(22), height: rem(22) }}
                                color="teal"
                            />
                        </ActionIcon>
                    </Group>
                ) : null}
                <BtnSubmit IconSection={IconRotate2}>Cargar datos</BtnSubmit>
            </Stack>
        </Box>
    );
};
