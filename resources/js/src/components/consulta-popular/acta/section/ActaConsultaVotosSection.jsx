import { useEffect } from "react";
import {
    Box,
    Card,
    Group,
    NumberInput,
    SimpleGrid,
    Stack,
    ThemeIcon,
    Text,
    TextInput,
    rem,
    Paper,
    Grid,
    Divider,
} from "@mantine/core";
import { TextSection } from "../../../../components";
import { useActaConsultaStore } from "../../../../hooks";
import { IconListDetails, IconUsers } from "@tabler/icons-react";
import classes from "../../../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";

export const ActaConsultaVotosSection = ({
    actaForm,
    totalesPorPregunta = [],
    votosValidosActa,
}) => {
    const { juntaInfo, info_acta, preguntas } = useActaConsultaStore();

    const getInfo = (idx) =>
        totalesPorPregunta.find((t) => t.index === idx) || {
            total: 0,
            coincide: false,
        };

    const toNumOrEmpty = (v) =>
        v === "" || v === null || v === undefined ? "" : Number(v);

    useEffect(() => {
        if (preguntas !== null && juntaInfo !== null && info_acta !== null) {
            //console.log("entra");
            //console.log(info_acta);
            actaForm.setValues({
                id: Number(info_acta.acta_id) || null,
                provincia_id: Number(juntaInfo.provincia_id),
                canton_id: Number(juntaInfo.canton_id),
                parroquia_id: Number(juntaInfo.parroquia_id),
                zona_id: Number(juntaInfo.zona_id),
                junta_id: Number(juntaInfo.junta_id),
                cod_cne: info_acta.cod_cne || "",
                votos_validos: info_acta.votos_validos || "",
                cuadrada: info_acta.cuadrada || false,
                legible: info_acta.legible || true,
                preguntas: preguntas.map((pregunta) => ({
                    pregunta_id: Number(pregunta.pregunta_id),
                    votos_si: toNumOrEmpty(pregunta.votos_si),
                    votos_no: toNumOrEmpty(pregunta.votos_no),
                    votos_blancos: toNumOrEmpty(pregunta.votos_blancos),
                    votos_nulos: toNumOrEmpty(pregunta.votos_nulos),
                })),
            });
        }
    }, [preguntas, juntaInfo, info_acta]);

    return (
        <Card withBorder radius="md" shadow="md" padding="md" mb={20}>
            <Card.Section inheritPadding py="md">
                <Group gap="md">
                    <ThemeIcon size="md" radius="md" variant="light">
                        <IconListDetails size={16} stroke={1.5} />
                    </ThemeIcon>
                    <div>
                        <TextSection tt="" fw={500} fz={18}>
                            Asignar Votos
                        </TextSection>
                    </div>
                </Group>
            </Card.Section>

            <Card.Section inheritPadding py="md">
                <Stack gap="xl">
                    {/* Informacion Acta */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        {/* Codigo CNE */}
                        <TextInput
                            label="Código CNE"
                            placeholder="Digita el código CNE"
                            classNames={classes}
                            {...actaForm.getInputProps("cod_cne")}
                        />
                        {/* Total Firmas */}
                        <NumberInput
                            classNames={classes}
                            hideControls
                            label={
                                <Group gap="xs" mb="xs">
                                    <IconUsers size={18} stroke={1.5} />
                                    <Text fw={500} size="xs">
                                        Total Firmas y Huellas
                                    </Text>
                                </Group>
                            }
                            min={0}
                            size="md"
                            styles={{
                                input: {
                                    fontWeight: 700,
                                    textAlign: "center",
                                    backgroundColor: "white",
                                },
                            }}
                            aria-label="Total Firmas y Huellas"
                            placeholder="0"
                            {...actaForm.getInputProps("votos_validos")}
                        />
                    </SimpleGrid>
                    {
                        /* Detalle Preguntas Votos */
                        <Box mt="md">
                            {preguntas.map((pregunta, index) => {
                                const casillero =
                                    pregunta.casillero_pregunta ??
                                    pregunta.numero_pregunta ??
                                    String(index + 1);

                                const { total, coincide } = getInfo(index);

                                const totalColor = coincide
                                    ? "var(--mantine-color-green-6)"
                                    : "var(--mantine-color-yellow-6)";

                                return (
                                    <Paper
                                        key={pregunta.pregunta_id ?? index}
                                        withBorder
                                        radius="md"
                                        p="xs"
                                        mb="sm"
                                        style={{
                                            overflow: "hidden",
                                            borderColor:
                                                "var(--mantine-color-gray-4)",
                                            background:
                                                "var(--mantine-color-gray-0)",
                                        }}
                                    >
                                        <Grid align="stretch" gutter="xs">
                                            {/* Columna izquierda: Casillero / Número / Total */}
                                            <Grid.Col
                                                span={{ base: 12, sm: 2 }}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "stretch",
                                                }}
                                            >
                                                <Box
                                                    style={{
                                                        width: "100%",
                                                        background:
                                                            "linear-gradient(180deg, var(--mantine-color-gray-1) 0%, var(--mantine-color-gray-2) 100%)",
                                                        borderRight:
                                                            "2px solid var(--mantine-color-gray-4)",
                                                        borderRadius: "8px",
                                                        padding: rem(8),
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent:
                                                            "center",
                                                        textAlign: "center",
                                                        minHeight: rem(140),
                                                    }}
                                                >
                                                    <Text
                                                        fw={900}
                                                        fz={30}
                                                        tt="uppercase"
                                                        style={{
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {casillero}
                                                    </Text>
                                                    <Divider my={6} />
                                                    <Text size="xs" c="dimmed">
                                                        Pregunta{" "}
                                                        {pregunta.numero_pregunta ??
                                                            index + 1}
                                                    </Text>
                                                    <Text
                                                        mt={4}
                                                        fw={700}
                                                        fz={14}
                                                        style={{
                                                            color: totalColor,
                                                            transition:
                                                                "color 120ms linear",
                                                        }}
                                                    >
                                                        Total: {total}
                                                    </Text>
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        mt={2}
                                                        style={{
                                                            lineHeight: 1.1,
                                                        }}
                                                    >
                                                        {votosValidosActa > 0
                                                            ? `vs válidos: ${votosValidosActa}`
                                                            : "Ingrese válidos"}
                                                    </Text>
                                                </Box>
                                            </Grid.Col>

                                            {/* Columna derecha: Inputs de votos */}
                                            <Grid.Col
                                                span={{ base: 12, sm: 10 }}
                                            >
                                                <Box
                                                    p="sm"
                                                    style={{
                                                        background: "white",
                                                        borderRadius: "8px",
                                                        border: "1px solid var(--mantine-color-gray-3)",
                                                    }}
                                                >
                                                    <SimpleGrid
                                                        cols={{
                                                            base: 1,
                                                            sm: 4,
                                                        }}
                                                        spacing="sm"
                                                        style={{
                                                            alignItems:
                                                                "stretch",
                                                        }}
                                                    >
                                                        <NumberInput
                                                            hideControls
                                                            label="BLANCOS"
                                                            min={0}
                                                            size="md"
                                                            styles={{
                                                                label: {
                                                                    fontWeight: 800,
                                                                    letterSpacing: 0.4,
                                                                    fontSize:
                                                                        rem(12),
                                                                },
                                                                input: {
                                                                    fontWeight: 900,
                                                                    textAlign:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "white",
                                                                    fontSize:
                                                                        rem(20),
                                                                    paddingBlock:
                                                                        rem(10),
                                                                },
                                                            }}
                                                            placeholder="0"
                                                            aria-label={`Votos Blancos Pregunta ${
                                                                index + 1
                                                            }`}
                                                            {...actaForm.getInputProps(
                                                                `preguntas.${index}.votos_blancos`
                                                            )}
                                                        />

                                                        <NumberInput
                                                            hideControls
                                                            label="NULOS"
                                                            min={0}
                                                            size="md"
                                                            styles={{
                                                                label: {
                                                                    fontWeight: 800,
                                                                    letterSpacing: 0.4,
                                                                    fontSize:
                                                                        rem(12),
                                                                },
                                                                input: {
                                                                    fontWeight: 900,
                                                                    textAlign:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "white",
                                                                    fontSize:
                                                                        rem(20),
                                                                    paddingBlock:
                                                                        rem(10),
                                                                },
                                                            }}
                                                            placeholder="0"
                                                            aria-label={`Votos Nulos Pregunta ${
                                                                index + 1
                                                            }`}
                                                            {...actaForm.getInputProps(
                                                                `preguntas.${index}.votos_nulos`
                                                            )}
                                                        />

                                                        <NumberInput
                                                            hideControls
                                                            label="SI"
                                                            min={0}
                                                            size="md"
                                                            styles={{
                                                                label: {
                                                                    fontWeight: 800,
                                                                    letterSpacing: 0.4,
                                                                    fontSize:
                                                                        rem(12),
                                                                },
                                                                input: {
                                                                    fontWeight: 900,
                                                                    textAlign:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "white",
                                                                    fontSize:
                                                                        rem(20),
                                                                    paddingBlock:
                                                                        rem(10),
                                                                },
                                                            }}
                                                            placeholder="0"
                                                            aria-label={`Votos Sí Pregunta ${
                                                                index + 1
                                                            }`}
                                                            {...actaForm.getInputProps(
                                                                `preguntas.${index}.votos_si`
                                                            )}
                                                        />

                                                        <NumberInput
                                                            hideControls
                                                            label="NO"
                                                            min={0}
                                                            size="md"
                                                            styles={{
                                                                label: {
                                                                    fontWeight: 800,
                                                                    letterSpacing: 0.4,
                                                                    fontSize:
                                                                        rem(12),
                                                                },
                                                                input: {
                                                                    fontWeight: 900,
                                                                    textAlign:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "white",
                                                                    fontSize:
                                                                        rem(20),
                                                                    paddingBlock:
                                                                        rem(10),
                                                                },
                                                            }}
                                                            placeholder="0"
                                                            aria-label={`Votos No Pregunta ${
                                                                index + 1
                                                            }`}
                                                            {...actaForm.getInputProps(
                                                                `preguntas.${index}.votos_no`
                                                            )}
                                                        />
                                                    </SimpleGrid>

                                                    {pregunta.texto_pregunta && (
                                                        <Text
                                                            mt="xs"
                                                            size="sm"
                                                            c="dimmed"
                                                            lineClamp={2}
                                                        >
                                                            {
                                                                pregunta.texto_pregunta
                                                            }
                                                        </Text>
                                                    )}
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </Paper>
                                );
                            })}
                        </Box>
                    }
                </Stack>
            </Card.Section>
        </Card>
    );
};
