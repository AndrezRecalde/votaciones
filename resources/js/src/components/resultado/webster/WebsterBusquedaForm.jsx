import { Box, Select, Stack } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { IconSearch } from "@tabler/icons-react";
import { useDignidadStore, useJurisdiccionStore, useResultadoStore } from "../../../hooks";

export const WebsterBusquedaForm = ({ form }) => {

    const { dignidades } = useDignidadStore();
    const { cantones } = useJurisdiccionStore();
    const {
        startLoadTotalDeVotos,
        startLoadTotalActasIngresadas,
        startLoadTotalJuntas,
        startLoadResultadosCandidatos,
    } = useResultadoStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await startLoadTotalDeVotos(form.getTransformedValues());
        await startLoadTotalActasIngresadas(form.getTransformedValues());
        await startLoadTotalJuntas(form.getTransformedValues());
        await startLoadResultadosCandidatos(form.getTransformedValues());
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
                <BtnSubmit IconSection={IconSearch}>Realizar Búsqueda</BtnSubmit>
            </Stack>
        </Box>
    );
};
