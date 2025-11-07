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
    TextInput,
} from "@mantine/core";
import { TextSection } from "../../../../components";
import { useActaConsultaStore } from "../../../../hooks";
import {
    IconCheckbox,
    IconFileCheck,
    IconListDetails,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";
import classes from "../../../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";

export const ActaConsultaVotosSection = ({ actaForm }) => {
    const { pregunta, juntaInfo } = useActaConsultaStore();

    useEffect(() => {
        if (pregunta !== null && juntaInfo !== null) {
            console.log("entra");
            console.log(juntaInfo);
            actaForm.setValues({
                id: Number(pregunta.id) || null,
                provincia_id: Number(juntaInfo.provincia_id),
                canton_id: Number(juntaInfo.canton_id),
                parroquia_id: Number(juntaInfo.parroquia_id),
                zona_id: Number(juntaInfo.zona_id),
                junta_id: Number(juntaInfo.junta_id),
                pregunta_id: Number(pregunta.pregunta_id),
                cod_cne: pregunta.cod_cne ?? "",
                votos_si: Number(pregunta.votos_si) || "",
                votos_no: Number(pregunta.votos_no) || "",
                votos_validos: Number(pregunta.votos_validos) || "",
                votos_blancos: Number(pregunta.votos_blancos) || "",
                votos_nulos: Number(pregunta.votos_nulos) || "",
                cuadrada: pregunta.cuadrada ?? false,
                legible: pregunta.legible ?? true,
            });
        }
    }, [pregunta, juntaInfo]);

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
                    {/* Pregunta */}
                    <Box>
                        <Text
                            fw={600}
                            size="md"
                            ta="left"
                            c="dark.7"
                            style={{ lineHeight: 1.5 }}
                        >
                            {pregunta?.texto_pregunta ||
                                "SIN INFORMACION DE LA PREGUNTA"}
                        </Text>
                    </Box>
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
                        {/* Votos */}
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
