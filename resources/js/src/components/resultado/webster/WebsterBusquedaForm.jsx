import { Box, Select, SimpleGrid, Stack } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { IconSearch } from "@tabler/icons-react";
import {
    useDignidadStore,
    useJurisdiccionStore,
    useResultadoStore,
} from "../../../hooks";

export const WebsterBusquedaForm = ({ form }) => {
    const { dignidades } = useDignidadStore();
    const { cantones, parroquias, zonas } = useJurisdiccionStore();
    const {
        isLoading,
        startLoadTotalDeVotos,
        startLoadTotalActasIngresadas,
        startLoadTotalJuntas,
        startLoadResultadosCandidatos,
    } = useResultadoStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        startLoadTotalDeVotos(form.getTransformedValues());
        startLoadTotalActasIngresadas(form.getTransformedValues());
        startLoadTotalJuntas(form.getTransformedValues());
        startLoadResultadosCandidatos(form.getTransformedValues());
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack>
                <Select
                    label="Dignidad"
                    placeholder="Seleccione una Dignidad"
                    searchable
                    //clearable
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
                    placeholder="Seleccione un cantón"
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
                <SimpleGrid cols={{ base: 2, xs: 1, sm: 1, md: 2, lg: 2 }}>
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
                <BtnSubmit IconSection={IconSearch} loading={isLoading}>
                    Realizar Búsqueda
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
