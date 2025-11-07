import { useEffect } from "react";
import { Box, Paper, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BtnSubmit } from "../../../../components";
import { useActaConsultaStore, useJurisdiccionStore } from "../../../../hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "../../../../assets/styles/modules/digitacion/LabelsDigitacion.module.css"

export const ResultadosConsultaFilter = ({ usuario }) => {
    const {
        startLoadCantones,
        startLoadParroquias,
        startLoadZonas,

        cantones,
        parroquias,
        zonas,
    } = useJurisdiccionStore();
    const { isLoading } = useActaConsultaStore();

    const form = useForm({
        initialValues: {
            canton_id: null,
            parroquia_id: null,
            //recinto_id: null,
            zona_id: null,
            cuadrada: "",
            legible: "",
        },
        transformValues: (values) => ({
            ...values,
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
            //recinto_id: Number(values.recinto_id) || 0,
            zona_id: Number(values.zona_id) || null,
            cuadrada: values.cuadrada !== "" ? Number(values.cuadrada) : null,
            legible: values.legible !== "" ? Number(values.legible) : null,
        }),
    });

    const { canton_id, parroquia_id } = form.values;

    useEffect(() => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        //Realizar la búsqueda con los filtros seleccionados
    };

    return (
        <Paper shadow="xs" p="md" radius="md" withBorder mb={20}>
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            >
                <Stack>
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
                        classNames={classes}
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
                        classNames={classes}
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
                        classNames={classes}
                    />
                    {/*  <Select
                        label="Recinto"
                        placeholder="Seleccione un Recinto"
                        searchable
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("recinto_id")}
                        data={recintos.map((recinto) => {
                            return {
                                label: recinto.nombre_recinto,
                                value: recinto.id.toString(),
                            };
                        })}
                    /> */}
                    <Select
                        label="Actas Cuadradas"
                        placeholder="¿Filtrar actas cuadradas?"
                        nothingFoundMessage="No options"
                        {...form.getInputProps("cuadrada")}
                        data={[
                            { label: "Si", value: "1" },
                            { label: "No", value: "0" },
                            { label: "TODAS", value: "" },
                        ]}
                        defaultValue="TODAS"
                        classNames={classes}
                    />
                    <Select
                        label="Actas Legibles"
                        placeholder="¿Filtrar actas legibles?"
                        nothingFoundMessage="No options"
                        {...form.getInputProps("legible")}
                        data={[
                            { label: "No", value: "0" },
                            { label: "Si", value: "1" },
                            { label: "TODAS", value: "" },
                        ]}
                        defaultValue="TODAS"
                        classNames={classes}
                    />
                    <BtnSubmit
                        height={50}
                        IconSection={IconSearch}
                        loading={isLoading}
                    >
                        Realizar Búsqueda
                    </BtnSubmit>
                </Stack>
            </Box>
        </Paper>
    );
};
