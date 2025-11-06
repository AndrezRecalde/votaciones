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
    Paper,
    rem,
} from "@mantine/core";
import { TextSection } from "../../../../components";
import { useActaConsultaStore } from "../../../../hooks";
import { IconListDetails, IconUsers } from "@tabler/icons-react";
import classes from "../../../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";

export const ActaConsultaVotosSection = ({ actaForm }) => {
    const { pregunta, juntaInfo } = useActaConsultaStore();

    useEffect(() => {
        if (pregunta !== null) {
            actaForm.setFieldValue({
                provincia_id: Number(juntaInfo.provincia_id),
                canton_id: Number(juntaInfo.canton_id),
                parroquia_id: Number(juntaInfo.parroquia_id),
                zona_id: Number(juntaInfo.zona_id),
                junta_id: Number(juntaInfo.id),
                pregunta_id: Number(pregunta.id),
                cod_cne: pregunta.cod_cne,
                votos_si: pregunta.votos_si ?? 0,
                votos_no: pregunta.votos_no ?? 0,
                votos_validos: pregunta.votos_validos ?? 0,
                votos_blancos: pregunta.votos_blancos ?? 0,
                votos_nulos: pregunta.votos_nulos ?? 0,
                cuadrada: pregunta.cuadrada ?? false,
                legible: pregunta.legible ?? false,
            });
        }
    }, [pregunta]);

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
                    {/* Total Firmas */}
                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        style={(theme) => ({
                            background: theme.colors.gray[0],
                            borderColor: theme.colors.gray[3],
                        })}
                    >
                        <NumberInput
                            classNames={classes}
                            hideControls
                            label={
                                <Group gap="xs" mb="xs">
                                    <IconUsers size={18} stroke={1.5} />
                                    <Text fw={600} size="xs">
                                        Total Firmas y Huellas
                                    </Text>
                                </Group>
                            }
                            min={0}
                            size="lg"
                            styles={{
                                input: {
                                    fontWeight: 700,
                                    fontSize: rem(20),
                                    textAlign: "center",
                                    backgroundColor: "white",
                                },
                            }}
                            aria-label="Total Firmas y Huellas"
                            placeholder="0"
                            {...actaForm.getInputProps("votos_validos")}
                        />
                    </Paper>

                    {/* Pregunta */}
                    <Box>
                        <Text
                            fw={600}
                            size="md"
                            ta="left"
                            c="dark.7"
                            style={{ lineHeight: 1.5 }}
                        >
                            {pregunta?.texto_pregunta || "SIN INFORMACION DE LA PREGUNTA"}
                        </Text>
                    </Box>

                    {/* Votos Grid */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <NumberInput
                            classNames={classes}
                            hideControls
                            label={
                                <Text fw={500} size="xs" mb="xs">
                                    Votos Blancos
                                </Text>
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
                            aria-label="Votos Blancos"
                            placeholder="0"
                            {...actaForm.getInputProps("votos_blancos")}
                        />
                        <NumberInput
                            classNames={classes}
                            hideControls
                            label={
                                <Text fw={500} size="xs" mb="xs">
                                    Votos Nulos
                                </Text>
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
                            aria-label="Votos Nulos"
                            placeholder="0"
                            {...actaForm.getInputProps("votos_nulos")}
                        />
                        <NumberInput
                            classNames={classes}
                            hideControls
                            label={
                                <Text fw={500} size="xs">
                                    Votos Sí
                                </Text>
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
                            aria-label="Votos Sí"
                            placeholder="0"
                            {...actaForm.getInputProps("votos_si")}
                        />
                        <NumberInput
                            classNames={classes}
                            hideControls
                            label={
                                <Text fw={500} size="xs">
                                    Votos No
                                </Text>
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
                            aria-label="Votos No"
                            placeholder="0"
                            {...actaForm.getInputProps("votos_no")}
                        />
                    </SimpleGrid>
                </Stack>
            </Card.Section>
        </Card>
    );
};
