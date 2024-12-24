import { useEffect } from "react";
import { Box, Select, SimpleGrid } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import {
    useActaStore,
    useDignidadStore,
    useJurisdiccionStore,
} from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";

export const BusquedaActaForm = ({ form }) => {
    const { canton_id } = form.values;
    const { dignidades } = useDignidadStore();
    const { startLoadParroquias, cantones, parroquias } =
        useJurisdiccionStore();
    const { startLoadActas } = useActaStore();

    useEffect(() => {
        startLoadParroquias({ canton_id });
        form.setFieldValue("parroquia_id", null);
    }, [canton_id]);

    const handleSearch = (e) => {
        e.preventDefault();
        const { errors } = form.validate();
        if (!errors.hasOwnProperty("dignidad_id")) {
            startLoadActas(form.getTransformedValues());
            //form.reset();
        }
    };

    return (
        <Box
            component="form"
            mx="auto"
            mt={20}
            onSubmit={form.onSubmit((_, e) => handleSearch(e))}
        >
            <SimpleGrid cols={{ base: 4, sm: 1, lg: 4 }}>
                <Select
                    label="Dignidad"
                    placeholder="Seleccione una Dignidad"
                    clearable
                    nothingFoundMessage="No options"
                    {...form.getInputProps("dignidad_id")}
                    data={dignidades.map((dignidad) => ({
                        label: dignidad.nombre_dignidad,
                        value: dignidad.id.toString(),
                    }))}
                />
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
    );
};
