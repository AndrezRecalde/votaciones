import { useEffect } from "react";
import {
    Box,
    Divider,
    Select,
    SimpleGrid,
    Stack,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import {
    useCandidatoStore,
    useDignidadStore,
    useDistritoStore,
    useJurisdiccionStore,
    useOrganizacionStore,
    useUiCandidato,
} from "../../../hooks";

export const CandidatoForm = ({ form }) => {
    const { provincia_id, canton_id, parroquia_id, distrito_id } = form.values;
    const { activateCandidato, startAddCandidatos } = useCandidatoStore();
    const { modalActionCandidato } = useUiCandidato();
    const { organizaciones } = useOrganizacionStore();
    const { distritos } = useDistritoStore();
    const { dignidades } = useDignidadStore();
    const {
        provincias,
        startLoadCantones,
        cantones,
        startLoadParroquias,
        parroquias,
    } = useJurisdiccionStore();
    const convertToString = (value) =>
        value !== null && value !== undefined ? value.toString() : null;

    useEffect(() => {
        startLoadCantones({ provincia_id });
        form.setFieldValue(
            "canton_id",
            activateCandidato?.canton_id
                ? activateCandidato?.canton_id.toString()
                : null
        );
    }, [provincia_id]);

    useEffect(() => {
        startLoadParroquias({ canton_id });
        form.setFieldValue(
            "parroquia_id",
            activateCandidato?.parroquia_id
                ? activateCandidato?.parroquia_id.toString()
                : null
        );
    }, [canton_id]);

    useEffect(() => {
        if (activateCandidato !== null) {
            const {
                organizacion_id,
                dignidad_id,
                distrito_id,
                provincia_id,
                canton_id,
                parroquia_id,
            } = activateCandidato;

            form.setValues({
                ...activateCandidato,
                organizacion_id: convertToString(organizacion_id),
                dignidad_id: convertToString(dignidad_id),
                distrito_id: convertToString(distrito_id),
                provincia_id: convertToString(provincia_id),
                canton_id: convertToString(canton_id),
                parroquia_id: convertToString(parroquia_id),
            });
            return;
        }
    }, [activateCandidato]);

    const handleSubmit = (e) => {
        e.preventDefault();
        startAddCandidatos(form.getTransformedValues());
        modalActionCandidato(false);
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Divider my="xs" />
            <Stack>
                <TextInput
                    withAsterisk
                    label="Nombres del candidato"
                    placeholder="Digite los nombres completos"
                    {...form.getInputProps("nombre_candidato")}
                />
                <Select
                    label="Organización"
                    placeholder="Seleccione la organización"
                    searchable
                    withAsterisk
                    nothingFoundMessage="No options"
                    {...form.getInputProps("organizacion_id")}
                    data={organizaciones.map((organizacion) => {
                        return {
                            label: organizacion.nombre_organizacion,
                            value: organizacion.id.toString(),
                        };
                    })}
                />
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
                <Select
                    label="Distrito"
                    placeholder="Seleccione el distrito"
                    searchable
                    withAsterisk
                    nothingFoundMessage="No options"
                    {...form.getInputProps("distrito_id")}
                    data={distritos.map((distrito) => {
                        return {
                            label: distrito.tipo_distrito,
                            value: distrito.id.toString(),
                        };
                    })}
                />
                {distrito_id == 1 || distrito_id == 2 || distrito_id == 3 ? (
                    <Select
                        label="Provincia"
                        placeholder="Seleccione la provincia"
                        searchable
                        withAsterisk
                        nothingFoundMessage="No options"
                        {...form.getInputProps("provincia_id")}
                        data={provincias.map((provincia) => {
                            return {
                                label: provincia.nombre_provincia,
                                value: provincia.id.toString(),
                            };
                        })}
                    />
                ) : null}

                {distrito_id == 2 || distrito_id == 3 ? (
                    <Select
                        label="Canton"
                        placeholder="Seleccione el canton"
                        searchable
                        withAsterisk
                        nothingFoundMessage="No options"
                        {...form.getInputProps("canton_id")}
                        data={cantones.map((canton) => {
                            return {
                                label: canton.nombre_canton,
                                value: canton.id.toString(),
                            };
                        })}
                    />
                ) : null}

                {distrito_id == 3 ? (
                    <Select
                        label="Parroquia"
                        placeholder="Seleccione la parroquia"
                        searchable
                        withAsterisk
                        nothingFoundMessage="No options"
                        {...form.getInputProps("parroquia_id")}
                        data={parroquias.map((parroquia) => {
                            return {
                                label: parroquia.nombre_parroquia,
                                value: parroquia.id.toString(),
                            };
                        })}
                    />
                ) : null}
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
