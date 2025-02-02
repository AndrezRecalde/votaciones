import { Box, Container, Divider, Grid } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    ActaCardDetalleForm,
    ActaCardForm,
    ActaCardInfo,
    ActaNovedadForm,
    TitlePage,
} from "../../components";
import { useActaStore, useStorageStore } from "../../hooks";
import { useEffect } from "react";

const ActaPage = () => {
    const { activateActa, existeActa, startAddActa, startUpdateActa } =
        useActaStore();
    const { selectedFields } = useStorageStore();

    const actaForm = useForm({
        initialValues: {
            cod_cne: "",
            votos_validos: "",
            votos_blancos: "",
            votos_nulos: "",
            cuadrada: true,
            legible: true,
            num_votos: [],
        },
        validate: {
            votos_validos: isNotEmpty(
                "Por favor ingrese el Total de Firmas y Huellas"
            ),
            votos_blancos: isNotEmpty("Por favor ingrese los votos blancos"),
            votos_nulos: isNotEmpty("Por favor ingrese los votos nulos"),
        },
        transformValues: (values) => ({
            ...values,
            votos_blancos: Number(values.votos_blancos) || 0,
            votos_nulos: Number(values.votos_nulos) || 0,
        }),
    });

    useEffect(() => {
        if (activateActa) {
            const {
                cod_cne,
                votos_validos,
                votos_blancos,
                votos_nulos,
                cuadrada,
                legible,
            } = activateActa;

            actaForm.setValues({
                cod_cne: cod_cne ?? "",
                votos_validos: Number(votos_validos) || "",
                votos_blancos: Number(votos_blancos) || 0,
                votos_nulos: Number(votos_nulos) || 0,
                cuadrada,
                legible,
            });
        }
    }, [activateActa]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (existeActa) {
            startUpdateActa(
                activateActa.id,
                selectedFields,
                actaForm.getTransformedValues()
            );
            actaForm.reset();
            return;
        }
        startAddActa(selectedFields, actaForm.getTransformedValues());
        //console.log(selectedFields, actaForm.getTransformedValues())
        actaForm.reset();
    };

    return (
        <Container size="xxl">
            <TitlePage ta="center" order={3}>
                {selectedFields.dignidad_id === 1
                    ? "Presidentes y Vicepresidentes"
                    : selectedFields.dignidad_id === 2
                    ? "Asambleistas Nacionales"
                    : "Asambleistas Provinciales"}
            </TitlePage>
            <Divider my="md" />
            <Box
                component="form"
                onSubmit={actaForm.onSubmit((_, e) => handleSubmit(e))}
                mt={15}
            >
                <Grid>
                    <Grid.Col
                        span={{ base: 6, xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                    >
                        <ActaCardInfo />
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 6, xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                    >
                        <ActaCardForm actaForm={actaForm} />
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 6, xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                    >
                        <ActaCardDetalleForm actaForm={actaForm} />
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 6, xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                    >
                        <ActaNovedadForm actaForm={actaForm} />
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    );
};

export default ActaPage;
