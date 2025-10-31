import { useEffect } from "react";
import {
    Badge,
    Box,
    Card,
    Container,
    Divider,
    Grid,
    Group,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import {
    ActaCardDetalleForm,
    ActaCardForm,
    ActaCardInfo,
    ActaNovedadForm,
    TextSection,
} from "../../components";
import { useActaStore, useStorageStore } from "../../hooks";
import {
    IconChecks,
} from "@tabler/icons-react";


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
            <Divider my="md" />
            <Box
                component="form"
                onSubmit={actaForm.onSubmit((_, e) => handleSubmit(e))}
                mt={15}
            >
                {/* Header con indicador visual */}
                <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
                    <Card.Section withBorder inheritPadding py="xs" bg="dark.5">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <ThemeIcon
                                    size="md"
                                    radius="md"
                                    variant="default"
                                >
                                    <IconChecks size={16} />
                                </ThemeIcon>
                                <div>
                                    <TextSection color="white" fw={700} fz={18} tt="">
                                        Detalles del Acta
                                    </TextSection>
                                </div>
                            </Group>
                            <Badge
                                leftSection="🗳️"
                                size="lg"
                                radius="sm"
                                variant="default"
                            >
                                {activateActa?.dignidad}
                            </Badge>
                        </Group>
                    </Card.Section>
                    <Card.Section>
                        <ActaCardInfo />
                    </Card.Section>
                </Card>

                {/* Grid Responsive Mejorado */}
                <Grid gutter={{ base: "md", md: "xl" }}>
                    {/* Sidebar: Formularios */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="md">
                            {/* Card 1: Datos */}

                            <ActaCardForm actaForm={actaForm} />

                            <ActaCardDetalleForm actaForm={actaForm} />
                        </Stack>
                    </Grid.Col>

                    {/* Main Content: Detalle Votos */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        {/* Card 2: Novedades */}
                        <ActaNovedadForm actaForm={actaForm} />
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    );
};

export default ActaPage;
