import { useEffect, useMemo } from "react";
import { Box, Select, SimpleGrid, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    useDignidadStore,
    useJurisdiccionStore,
    useResultadoStore,
    useStorageStore,
} from "../../hooks";
import { BtnSubmit } from "../../components";
import { IconSearch } from "@tabler/icons-react";

export const ResultadoBusquedaForm = ({ dig }) => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const form = useForm({
        initialValues: {
            dignidad_id: dig.toString(),
            canton_id: null,
            parroquia_id: null,
            //recinto_id: null,
            zona_id: null,
            cuadrada: "",
            legible: "",
        },
        transformValues: (values) => ({
            ...values,
            dignidad_id: Number(values.dignidad_id) || null,
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
            //recinto_id: Number(values.recinto_id) || 0,
            zona_id: Number(values.zona_id) || null,
            cuadrada: values.cuadrada !== "" ? Number(values.cuadrada) : null,
            legible: values.legible !== "" ? Number(values.legible) : null,
        }),
    });

    const { canton_id, parroquia_id } = form.values;
    const { startLoadDignidades, dignidades } = useDignidadStore();
    const {
        startLoadCantones,
        startLoadParroquias,
        //startLoadZonas,
        startLoadZonas,
        cantones,
        parroquias,
        zonas
    } = useJurisdiccionStore();
    const {
        isLoading,
        startLoadTotalDeVotos,
        startLoadTotalActasIngresadas,
        startLoadTotalJuntas,
        startLoadResultadosCandidatos,
    } = useResultadoStore();

    const { setStorageFields } = useStorageStore();

    useEffect(() => {
        startLoadDignidades({ activo: true });
    }, []);

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
        setStorageFields(form.getTransformedValues());
        startLoadTotalDeVotos(form.getTransformedValues());
        startLoadTotalActasIngresadas(form.getTransformedValues());
        startLoadTotalJuntas(form.getTransformedValues());
        startLoadResultadosCandidatos(form.getTransformedValues());
        console.log(form.getTransformedValues());
    };

    return (
        <Box
            component="form"
            mx={15}
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            mb={30}
        >
            <Stack>
                <SimpleGrid cols={{ base: 4, xs: 1, sm: 2, md: 4, lg: 4 }}>
                    <Select
                        label="Dignidad"
                        placeholder="Seleccione una Dignidad"
                        searchable
                        //clearable
                        nothingFoundMessage="No options"
                        //disabled
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
                </SimpleGrid>
                <SimpleGrid cols={{ base: 2, xs: 1, sm: 1, md: 2, lg: 2 }}>
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
                    />
                </SimpleGrid>
                <BtnSubmit
                    heigh={50}
                    IconSection={IconSearch}
                    loading={isLoading}
                >
                    Realizar Búsqueda
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
