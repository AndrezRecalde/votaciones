import { useEffect } from "react";
import {
    Avatar,
    Card,
    Group,
    NumberInput,
    ThemeIcon,
    Text,
    Badge,
    Stack,
    Box,
    Center,
    useMantineTheme,
} from "@mantine/core";
import { IconListDetails, IconUsers } from "@tabler/icons-react";
import { TextSection } from "../../components";
import { useActaStore, useStorageStore } from "../../hooks";
import classes from "../../assets/styles/modules/digitacion/ActaDetalleForm.module.css";

export const ActaCardDetalleForm = ({ actaForm }) => {
    const {
        existeActa,
        activateActa,
        startLoadCandidatos,
        activateCandidatos,
    } = useActaStore();
    const { selectedFields } = useStorageStore();
    const theme = useMantineTheme();

    // Cargar candidatos (con pequeño debounce)
    useEffect(() => {
        const timeout = setTimeout(() => {
            startLoadCandidatos(activateActa ?? selectedFields);
        }, 300);

        return () => clearTimeout(timeout);
    }, [existeActa, selectedFields]);

    // Sincronizar valores de votos con el form
    useEffect(() => {
        if (activateCandidatos !== null && Array.isArray(activateCandidatos)) {
            activateCandidatos.forEach((candidato, index) => {
                actaForm.setFieldValue(
                    `num_votos.${index}`,
                    candidato?.num_votos ??
                        actaForm.values?.num_votos?.[index] ??
                        0
                );
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activateCandidatos]);

    return (
        <Card withBorder radius="lg" className={classes.card}>
            <Card.Section inheritPadding py="xs" className={classes.header}>
                <Group spacing="sm">
                    <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="default"
                    >
                        <IconListDetails size={18} />
                    </ThemeIcon>

                    <div>
                        <TextSection tt="" fw={700} fz={18}>
                            Asignar Votos
                        </TextSection>
                    </div>
                </Group>
            </Card.Section>

            <Card.Section inheritPadding py="lg" className={classes.content}>
                {Array.isArray(activateCandidatos) &&
                activateCandidatos.length > 0 ? (
                    <Stack spacing="md">
                        {activateCandidatos.map((candidato, index) => {
                            const key = candidato?.id ?? `candidato-${index}`;
                            return (
                                <Box
                                    key={key}
                                    className={classes.item}
                                    role="group"
                                >
                                    <div className={classes.itemLeft}>
                                        <div className={classes.avatarWrap}>
                                            <Avatar
                                                src={
                                                    candidato?.logo_url
                                                        ? `/storage${candidato.logo_url}`
                                                        : undefined
                                                }
                                                alt={
                                                    candidato?.nombre_candidato ??
                                                    "Candidato"
                                                }
                                                size={64}
                                                radius="xl"
                                                color="gray"
                                            />
                                        </div>
                                        <div className={classes.info}>
                                            <Stack gap={5}>
                                                <TextSection
                                                    fw={700}
                                                    fz={15}
                                                    ta="left"
                                                >
                                                    {candidato?.nombre_candidato ??
                                                        "—"}
                                                </TextSection>

                                                <TextSection
                                                    size={12}
                                                    color="dimmed"
                                                    fs="italic"
                                                >
                                                    {candidato?.nombre_organizacion ??
                                                        "—"}
                                                </TextSection>

                                                <Group spacing={8}>
                                                    <Badge
                                                        variant="light"
                                                        color={candidato?.color}
                                                        radius="sm"
                                                        size="md"
                                                    >
                                                        Lista:{" "}
                                                        {candidato?.numero_organizacion ??
                                                            "—"}
                                                    </Badge>
                                                </Group>
                                            </Stack>
                                        </div>
                                    </div>

                                    <div className={classes.controls}>
                                        <NumberInput
                                            hideControls
                                            min={0}
                                            size="lg"
                                            styles={{
                                                input: {
                                                    fontWeight: 700,
                                                    textAlign: "center",
                                                },
                                            }}
                                            aria-label={`Votos ${
                                                candidato?.nombre_candidato ??
                                                index
                                            }`}
                                            placeholder="0"
                                            {...actaForm.getInputProps(
                                                `num_votos.${index}`
                                            )}
                                            className={classes.numberInput}
                                        />
                                    </div>
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    <Center className={classes.emptyState} py="lg">
                        <Stack align="center" spacing="xs">
                            <IconUsers size={34} color={theme.colors.gray[5]} />
                            <TextSection color="dimmed">
                                No hay candidatos disponibles
                            </TextSection>
                        </Stack>
                    </Center>
                )}
            </Card.Section>
        </Card>
    );
};
