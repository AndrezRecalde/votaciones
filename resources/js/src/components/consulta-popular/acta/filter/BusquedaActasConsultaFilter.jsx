import { Box, Paper, Select, SimpleGrid } from "@mantine/core";
import { useEffect } from "react";
import { useActaConsultaStore, useJurisdiccionStore } from "../../../../hooks";
import { BtnSubmit } from "../../../../components";
import { IconSearch } from "@tabler/icons-react";

export const BusquedaActasConsultaFilter = ({ form }) => {
    const { canton_id, parroquia_id } = form.values;
    const { startLoadParroquias, startLoadZonas, cantones, parroquias, zonas } =
        useJurisdiccionStore();
        const { startLoadActasConsulta } = useActaConsultaStore();

    useEffect(() => {
        canton_id
            ? startLoadParroquias({ canton_id })
            : form.setFieldValue("parroquia_id", null);
    }, [canton_id]);

    useEffect(() => {
        parroquia_id
            ? startLoadZonas({ parroquia_id })
            : form.setFieldValue("zona_id", null);
    }, [parroquia_id]);

    const handleSearch = (e) => {
        e.preventDefault();
        //console.log(form.getTransformedValues());
        startLoadActasConsulta(form.getTransformedValues());
    };

    return (
        <Paper shadow="xs" p="md" radius="md" withBorder mb={20}>
            <Box
                component="form"
                onSubmit={form.onSubmit((_, e) => handleSearch(e))}
            >
                <SimpleGrid cols={{ base: 4, sm: 1, lg: 4 }}>
                    <Select
                        label="Cantón"
                        placeholder="Seleccione un cantón"
                        searchable
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("canton_id")}
                        data={cantones.map((canton) => ({
                            label: canton.nombre_canton,
                            value: canton.id.toString(),
                        }))}
                    />
                    <Select
                        label="Parroquia"
                        placeholder="Seleccione una Parroquia"
                        searchable
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("parroquia_id")}
                        data={parroquias.map((parroquia) => ({
                            label: parroquia.nombre_parroquia,
                            value: parroquia.id.toString(),
                        }))}
                    />
                    <Select
                        label="Zonas"
                        placeholder="Seleccione una Zona"
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("zona_id")}
                        data={zonas.map((zona) => ({
                            label: zona.nombre_zona,
                            value: zona.id.toString(),
                        }))}
                    />
                    <Select
                        label="Tipo de Acta"
                        placeholder="Seleccione un tipo de Acta"
                        searchable
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("tipo_acta")}
                        data={[
                            { label: "TODAS", value: "" },
                            { label: "Consistentes", value: "1" },
                            { label: "Inconsistentes", value: "0" },
                        ]}
                    />
                </SimpleGrid>
                <BtnSubmit IconSection={IconSearch}>Buscar Acta(s)</BtnSubmit>
            </Box>
        </Paper>
    );
};
