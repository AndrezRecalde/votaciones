import { useEffect } from "react";
import { Box, Paper, Select, SimpleGrid, Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    useJurisdiccionStore,
    usePreguntaStore,
    useTendenciaConsultaStore,
} from "../../../../hooks";
import { BtnSubmit } from "../../../../components";
import { IconSearch } from "@tabler/icons-react";
import classes from "../../../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";

export const SeguimientoBusquedaForm = () => {
    const { cantones, parroquias, zonas, startLoadParroquias, startLoadZonas } =
        useJurisdiccionStore();
        const { preguntas } = usePreguntaStore();

    const { isLoading, startLoadTendenciasConsulta } =
        useTendenciaConsultaStore();

    const form = useForm({
        initialValues: {
            canton_id: null,
            parroquia_id: null,
            zona_id: null,
            pregunta_id: null,
        },
        validate: {
            canton_id: isNotEmpty("Por favor seleccione un cantón"),
            parroquia_id: isNotEmpty("Por favor seleccione una parroquia"),
            zona_id: isNotEmpty("Por favor seleccione una zona"),
            pregunta_id: isNotEmpty("Por favor seleccione una pregunta"),
        },
        transformValues: (values) => ({
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
            zona_id: Number(values.zona_id) || null,
            pregunta_id: Number(values.pregunta_id) || null,
        }),
    });

    const { canton_id, parroquia_id } = form.values;

    useEffect(() => {
        if (canton_id !== null) {
            startLoadParroquias({ canton_id });
            form.setFieldValue("parroquia_id", null);
        }
    }, [canton_id]);

    useEffect(() => {
        if (parroquia_id !== null) {
            startLoadZonas({ parroquia_id });
            form.setFieldValue("zona_id", null);
        }
    }, [parroquia_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { zona_id, pregunta_id } = form.getTransformedValues();
        //console.log({ zona_id, pregunta_id });
        startLoadTendenciasConsulta({
            zona_id,
            pregunta_id,
        });
    };

    return (
        <Paper shadow="xs" p="md" radius="md" withBorder mb={20}>
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            >
                <Stack>
                    <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 4, lg: 4 }}>
                        <Select
                            label="Cantón"
                            placeholder="Seleccione una cantón"
                            searchable
                            clearable
                            classNames={classes}
                            nothingFoundMessage="No options"
                            {...form.getInputProps("canton_id")}
                            data={cantones.map((canton) => {
                                return {
                                    label: canton.nombre_canton,
                                    value: canton.id.toString(),
                                };
                            })}
                        />
                        <Select
                            label="Parroquia"
                            placeholder="Seleccione una Parroquia"
                            searchable
                            clearable
                            classNames={classes}
                            nothingFoundMessage="No options"
                            {...form.getInputProps("parroquia_id")}
                            data={parroquias.map((parroquia) => {
                                return {
                                    label: parroquia.nombre_parroquia,
                                    value: parroquia.id.toString(),
                                };
                            })}
                        />
                        <Select
                            label="Zona"
                            placeholder="Seleccione una Zona"
                            searchable
                            clearable
                            classNames={classes}
                            nothingFoundMessage="No options"
                            {...form.getInputProps("zona_id")}
                            data={zonas.map((zona) => {
                                return {
                                    label: zona.nombre_zona,
                                    value: zona.id.toString(),
                                };
                            })}
                        />
                        <Select
                            label="Pregunta"
                            placeholder="Seleccione una pregunta"
                            searchable
                            clearable
                            classNames={classes}
                            nothingFoundMessage="No options"
                            {...form.getInputProps("pregunta_id")}
                            data={preguntas.map((pregunta) => {
                                return {
                                    label: pregunta.descripcion,
                                    value: pregunta.id.toString(),
                                };
                            })}
                        />
                    </SimpleGrid>
                    <BtnSubmit IconSection={IconSearch} loading={isLoading}>
                        Realizar Búsqueda
                    </BtnSubmit>
                </Stack>
            </Box>
        </Paper>
    );
};
