import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Select } from "@mantine/core";
import { BtnSubmit } from "../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    useActaStore,
    useDignidadStore,
    useJurisdiccionStore,
    useStorageStore,
} from "../../hooks";
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
        disabledSearch,
        startLoadInfoJunta,
        startLoadActa,
        startActivateSearch,
    } = useActaStore();
    const { dignidades, startLoadDignidades } = useDignidadStore();
    const { setStorageFields } = useStorageStore();
    const [disabled, setDisabled] = useState(false);
    //const isValid = (value) => value !== null && value !== undefined;

    // Valores iniciales y validación
    const INITIAL_PROVINCIA_ID = usuario?.provincia_id;

    const searchForm = useForm({
        initialValues: {
            dignidad_id: 1,
            provincia_id: INITIAL_PROVINCIA_ID,
            canton_id: null,
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

    // Cargar datos iniciales
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

    // Efectos combinados para dependencias
    useEffect(() => {
        if (provincia_id) searchForm.setFieldValue("canton_id", null);
        startLoadCantones({ provincia_id });
    }, [provincia_id]);

    useEffect(() => {
        if (canton_id) searchForm.setFieldValue("parroquia_id", null);
        startLoadParroquias({ canton_id });
    }, [canton_id]);

    useEffect(() => {
        if (parroquia_id) searchForm.setFieldValue("zona_id", null);
        startLoadZonas({ parroquia_id });
    }, [canton_id, parroquia_id]);

    useEffect(() => {
        if (zona_id) searchForm.setFieldValue("junta_id", null);
        startLoadJuntas({ zona_id });
    }, [canton_id, zona_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStorageFields(searchForm.getTransformedValues());
        startLoadInfoJunta(junta_id);
        startLoadActa(dignidad_id, junta_id);
        startActivateSearch(true);
    };

    return (
        <Box
            component="form"
            mx="auto"
            onSubmit={searchForm.onSubmit((_, e) => handleSubmit(e))}
            mb={30}
        >
            <Grid mt={10} mb={10}>
                <Grid.Col span={{ base: 4, xs: 4, md: 2, lg: 2, xl: 2 }}>
                    <Select
                        radius="sm"
                        label="Provincia"
                        placeholder="Seleccione la Provincia"
                        variant="filled"
                        withAsterisk
                        disabled
                        nothingFoundMessage="No options"
                        classNames={classes}
                        {...searchForm.getInputProps("provincia_id")}
                        data={provincias.map((provincia) => {
                            return {
                                value: provincia.id.toString(),
                                label: provincia.nombre_provincia,
                            };
                        })}
                    />
                </Grid.Col>
                <Grid.Col
                    span={{ base: 4, xs: 4, sm: 4, md: 2.2, lg: 2.2, xl: 2.2 }}
                >
                    <Select
                        radius="sm"
                        label="Dignidad"
                        placeholder="Seleccione la Dignidad"
                        withAsterisk
                        searchable
                        classNames={classes}
                        {...searchForm.getInputProps("dignidad_id")}
                        nothingFoundMessage="No options"
                        //disabled
                        disabled={disabledSearch}
                        data={dignidades.map((dignidad) => {
                            return {
                                value: dignidad.id.toString(),
                                label: dignidad.nombre_dignidad,
                            };
                        })}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 4, xs: 4, sm: 4, md: 2, lg: 2, xl: 2 }}>
                    <Select
                        radius="sm"
                        label="Cantón"
                        placeholder="Seleccione el Cantón"
                        withAsterisk
                        searchable
                        nothingFoundMessage="No options"
                        classNames={classes}
                        disabled={disabled ? disabled : disabledSearch}
                        {...searchForm.getInputProps("canton_id")}
                        data={cantones.map((canton) => {
                            return {
                                value: canton.id.toString(),
                                label: canton.nombre_canton,
                            };
                        })}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 4, xs: 4, sm: 4, md: 2, lg: 2, xl: 2 }}>
                    <Select
                        radius="sm"
                        label="Parroquia"
                        placeholder="Seleccione la Parroquia"
                        withAsterisk
                        searchable
                        nothingFoundMessage="No options"
                        disabled={disabledSearch}
                        classNames={classes}
                        {...searchForm.getInputProps("parroquia_id")}
                        data={parroquias.map((parroquia) => {
                            return {
                                value: parroquia.id.toString(),
                                label: parroquia.nombre_parroquia,
                            };
                        })}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 4, xs: 4, sm: 4, md: 2, lg: 2, xl: 2 }}>
                    <Select
                        radius="sm"
                        label="Zona"
                        placeholder="Seleccione la Zona"
                        withAsterisk
                        searchable
                        nothingFoundMessage="No options"
                        disabled={disabledSearch}
                        classNames={classes}
                        {...searchForm.getInputProps("zona_id")}
                        data={zonas.map((zona) => {
                            return {
                                value: zona.id.toString(),
                                label: zona.nombre_zona,
                            };
                        })}
                    />
                </Grid.Col>
                <Grid.Col
                    span={{ base: 4, xs: 4, sm: 4, md: 1.8, lg: 1.8, xl: 1.8 }}
                >
                    <Select
                        radius="sm"
                        label="Junta"
                        placeholder="Seleccione la Junta"
                        withAsterisk
                        searchable
                        nothingFoundMessage="No options"
                        disabled={disabledSearch}
                        classNames={classes}
                        {...searchForm.getInputProps("junta_id")}
                        data={juntas.map((junta) => {
                            return {
                                value: junta.id.toString(),
                                label: junta.junta_nombre,
                            };
                        })}
                    />
                </Grid.Col>
            </Grid>
            <BtnSubmit disabled={disabledSearch} fontSize={20} heigh={50}>
                Buscar acta
            </BtnSubmit>
        </Box>
    );
};
