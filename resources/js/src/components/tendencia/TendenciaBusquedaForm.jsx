import { useEffect } from "react";
import { Box, Select, SimpleGrid, Stack } from "@mantine/core";
import { BtnSubmit } from "..";
import {
    useDignidadStore,
    useJurisdiccionStore,
    useTendenciaStore,
} from "../../hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";

export const TendenciaBusquedaForm = () => {
    const { dignidades } = useDignidadStore();
    const {
        cantones,
        parroquias,
        zonas,
        startLoadParroquias,
        startLoadZonas,
    } = useJurisdiccionStore();
    const { startLoadTendencias } = useTendenciaStore();

    const form = useForm({
        initialValues: {
            dignidad_id: null,
            canton_id: null,
            parroquia_id: null,
            zona_id: null,
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor seleccione una dignidad"),
            canton_id: isNotEmpty("Por favor seleccione un cantón"),
            parroquia_id: isNotEmpty("Por favor seleccione una parroquia"),
            zona_id: isNotEmpty("Por favor seleccione una zona"),
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || null,
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
            zona_id: Number(values.zona_id) || null,
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
        startLoadTendencias(form.getTransformedValues());
    };

    return (
        <Box
            component="form"
            mx={15}
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            mb={100}
        >
            <Stack>
                <SimpleGrid cols={{ base: 4, xs: 1, sm: 2, md: 4, lg: 4 }}>
                    <Select
                        label="Dignidad"
                        placeholder="Seleccione una Dignidad"
                        searchable
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("dignidad_id")}
                        data={dignidades.map((dignidad) => {
                            return {
                                label: dignidad.nombre_dignidad,
                                value: dignidad.id.toString(),
                            };
                        })}
                    />
                    <Select
                        label="Cantón"
                        placeholder="Seleccione una cantón"
                        searchable
                        clearable
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
                        nothingFoundMessage="No options"
                        {...form.getInputProps("zona_id")}
                        data={zonas.map((zona) => {
                            return {
                                label: zona.nombre_zona,
                                value: zona.id.toString(),
                            };
                        })}
                    />
                </SimpleGrid>
                <BtnSubmit IconSection={IconSearch}>
                    Realizar Búsqueda
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
