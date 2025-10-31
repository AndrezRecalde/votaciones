import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Select, Paper, Title, Group } from "@mantine/core";
import { BtnSubmit } from "../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    useActaStore,
    useDignidadStore,
    useJurisdiccionStore,
    useStorageStore,
} from "../../hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";

const isValid = (value) => value !== null && value !== undefined;

const convertToString = (value) =>
    value !== null && value !== undefined ? value.toString() : null;

export const SeleccionForm = () => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const {
        provincias,
        cantones,
        parroquias,
        zonas,
        juntas,
        startLoadProvincias,
        startLoadCantones,
        startLoadParroquias,
        startLoadZonas,
        startLoadJuntas,
    } = useJurisdiccionStore();

    const {
        isLoading,
        disabledSearch,
        startLoadInfoJunta,
        startLoadActa,
        startActivateSearch,
    } = useActaStore();

    const { dignidades, startLoadDignidades } = useDignidadStore();
    const { setStorageFields } = useStorageStore();
    const [disabled, setDisabled] = useState(false);

    const INITIAL_PROVINCIA_ID = usuario?.provincia_id;
    const INITIAL_CANTON_ID = usuario?.canton_id || null;

    const searchForm = useForm({
        initialValues: {
            dignidad_id: "1",
            provincia_id: convertToString(INITIAL_PROVINCIA_ID),
            canton_id: convertToString(INITIAL_CANTON_ID),
            parroquia_id: null,
            zona_id: null,
            junta_id: null,
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor ingrese una dignidad"),
            provincia_id: isNotEmpty("Por favor ingrese la provincia del acta"),
            canton_id: isNotEmpty("Por favor ingrese el cantón del acta"),
            parroquia_id: isNotEmpty("Por favor ingresa la parroquia del acta"),
            zona_id: isNotEmpty("Por favor ingrese la zona del acta"),
            junta_id: isNotEmpty("Por favor ingrese la junta del acta"),
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || null,
            provincia_id: Number(values.provincia_id) || null,
            canton_id: Number(values.canton_id) || null,
            parroquia_id: Number(values.parroquia_id) || null,
            zona_id: Number(values.zona_id) || null,
            junta_id: Number(values.junta_id) || null,
        }),
    });

    const {
        dignidad_id,
        provincia_id,
        canton_id,
        parroquia_id,
        zona_id,
        junta_id,
    } = searchForm.values;

    useEffect(() => {
        if (provincia_id) searchForm.setFieldValue("canton_id", null);
        startLoadCantones({ provincia_id });
    }, [provincia_id]);

    useEffect(() => {
        if (canton_id) searchForm.setFieldValue("parroquia_id", null);
        startLoadParroquias({ canton_id });
    }, [canton_id]);

    useEffect(() => {
        if (parroquia_id && canton_id) searchForm.setFieldValue("zona_id", null);
        startLoadZonas({ parroquia_id });
    }, [canton_id, parroquia_id]);

    useEffect(() => {
        if (zona_id && canton_id) searchForm.setFieldValue("junta_id", null);
        startLoadJuntas({ zona_id });
    }, [canton_id, zona_id]);

    useEffect(() => {
        startLoadProvincias({
            provincia_id: usuario.provincia_id,
            activo: true,
        });
        searchForm.setFieldValue(
            "provincia_id",
            convertToString(usuario.provincia_id)
        );

        if (isValid(usuario.canton_id)) {
            searchForm.setFieldValue(
                "canton_id",
                convertToString(usuario.canton_id)
            );
            setDisabled(true);
        }

        startLoadDignidades({ activo: true });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStorageFields(searchForm.getTransformedValues());
        startLoadInfoJunta(junta_id);
        startLoadActa(dignidad_id, junta_id);
        startActivateSearch(true);
    };

    return (
        <Paper
            shadow="xs"
            p="md"
            radius="md"
            withBorder
            mb={20}
        >
            <Box
                component="form"
                onSubmit={searchForm.onSubmit((_, e) => handleSubmit(e))}
            >

                <Grid gutter="xs">
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                        <Select
                            radius="sm"
                            size="sm"
                            label="Provincia"
                            placeholder="Provincia"
                            withAsterisk
                            disabled
                            nothingFoundMessage="Sin opciones"
                            classNames={classes}
                            {...searchForm.getInputProps("provincia_id")}
                            styles={{
                                label: { fontSize: "0.8rem", fontWeight: 500 },
                                input: { fontSize: "0.85rem" }
                            }}
                            data={provincias.map((provincia) => ({
                                value: provincia.id.toString(),
                                label: provincia.nombre_provincia,
                            }))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                        <Select
                            radius="sm"
                            size="sm"
                            label="Dignidad"
                            placeholder="Dignidad"
                            withAsterisk
                            searchable
                            classNames={classes}
                            {...searchForm.getInputProps("dignidad_id")}
                            nothingFoundMessage="Sin opciones"
                            disabled={disabledSearch}
                            styles={{
                                label: { fontSize: "0.8rem", fontWeight: 500 },
                                input: { fontSize: "0.85rem" }
                            }}
                            data={dignidades.map((dignidad) => ({
                                value: dignidad.id.toString(),
                                label: dignidad.nombre_dignidad,
                            }))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                        <Select
                            radius="sm"
                            size="sm"
                            label="Cantón"
                            placeholder="Cantón"
                            withAsterisk
                            searchable
                            nothingFoundMessage="Sin opciones"
                            classNames={classes}
                            disabled={disabled ? disabled : disabledSearch}
                            {...searchForm.getInputProps("canton_id")}
                            styles={{
                                label: { fontSize: "0.8rem", fontWeight: 500 },
                                input: { fontSize: "0.85rem" }
                            }}
                            data={cantones.map((canton) => ({
                                value: canton.id.toString(),
                                label: canton.nombre_canton,
                            }))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                        <Select
                            radius="sm"
                            size="sm"
                            label="Parroquia"
                            placeholder="Parroquia"
                            withAsterisk
                            searchable
                            nothingFoundMessage="Sin opciones"
                            disabled={disabledSearch}
                            classNames={classes}
                            {...searchForm.getInputProps("parroquia_id")}
                            styles={{
                                label: { fontSize: "0.8rem", fontWeight: 500 },
                                input: { fontSize: "0.85rem" }
                            }}
                            data={parroquias.map((parroquia) => ({
                                value: parroquia.id.toString(),
                                label: parroquia.nombre_parroquia,
                            }))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                        <Select
                            radius="sm"
                            size="sm"
                            label="Zona"
                            placeholder="Zona"
                            withAsterisk
                            searchable
                            nothingFoundMessage="Sin opciones"
                            disabled={disabledSearch}
                            classNames={classes}
                            {...searchForm.getInputProps("zona_id")}
                            styles={{
                                label: { fontSize: "0.8rem", fontWeight: 500 },
                                input: { fontSize: "0.85rem" }
                            }}
                            data={zonas.map((zona) => ({
                                value: zona.id.toString(),
                                label: zona.nombre_zona,
                            }))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 2 }}>
                        <Select
                            radius="sm"
                            size="sm"
                            label="Junta"
                            placeholder="Junta"
                            withAsterisk
                            searchable
                            nothingFoundMessage="Sin opciones"
                            disabled={disabledSearch}
                            classNames={classes}
                            {...searchForm.getInputProps("junta_id")}
                            styles={{
                                label: { fontSize: "0.8rem", fontWeight: 500 },
                                input: { fontSize: "0.85rem" }
                            }}
                            data={juntas.map((junta) => ({
                                value: junta.id.toString(),
                                label: junta.junta_nombre,
                            }))}
                        />
                    </Grid.Col>
                </Grid>

                <Box mt="md">
                    <BtnSubmit
                        disabled={disabledSearch}
                        loading={isLoading}
                        IconSection={IconSearch}
                        fontSize={16}
                    >
                        Buscar
                    </BtnSubmit>
                </Box>
            </Box>
        </Paper>
    );
};
