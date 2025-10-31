import { useEffect, useState } from "react";
import { useActaStore } from "../../hooks";
import {
    ActionIcon,
    Card,
    Checkbox,
    Flex,
    Group,
    Paper,
    Stack,
    Grid,
    Text,
    ThemeIcon,
    Divider,
    Badge,
    Tooltip,
    Box,
} from "@mantine/core";
import { BtnSubmit, TextSection } from "../../components";
import {
    IconCheckbox,
    IconRotate2,
    IconAlertCircle,
    IconCheck,
    IconX,
    IconFileCheck,
    IconCalculator,
    IconUser,
} from "@tabler/icons-react";

export const ActaNovedadForm = ({ actaForm }) => {
    const [totales, setTotales] = useState(0);

    const { startClearActa, startActivateSearch, activateActa } =
        useActaStore();

    const {
        num_votos,
        votos_blancos,
        votos_nulos,
        votos_validos,
        legible,
        cuadrada,
    } = actaForm.values;

    useEffect(() => {
        setTotales(
            num_votos
                .filter((num) => num !== undefined)
                .reduce((a, b) => parseInt(a) + parseInt(b), 0)
        );
    }, [num_votos]);

    useEffect(() => {
        if (totales + votos_blancos + votos_nulos !== votos_validos) {
            actaForm.setFieldValue("cuadrada", false);
        } else {
            actaForm.setFieldValue("cuadrada", true);
        }
    }, [totales, votos_validos, votos_blancos, votos_nulos]);

    const handleResetSearch = () => {
        startClearActa();
        startActivateSearch(false);
    };

    const esCuadrada = totales + votos_blancos + votos_nulos === votos_validos;

    return (
        <Stack gap="md">
            {/* Sección de Validaciones */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="sm" gap="xs">
                    <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="default"
                        color="orange"
                    >
                        <IconAlertCircle size={18} />
                    </ThemeIcon>
                    <div>
                        <Text fw={600} size="sm">
                            Validaciones del Acta
                        </Text>
                        <Text size="xs" c="dimmed">
                            Verificación de integridad
                        </Text>
                    </div>
                </Group>

                <Divider mb="md" />

                <Stack gap="sm">
                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        style={{
                            backgroundColor: legible
                                ? "var(--mantine-color-green-0)"
                                : "var(--mantine-color-red-0)",
                            borderColor: legible
                                ? "var(--mantine-color-green-3)"
                                : "var(--mantine-color-red-3)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <Group justify="space-between" wrap="nowrap">
                            <Checkbox
                                label={
                                    <Text size="sm" fw={500}>
                                        Acta legible y clara
                                    </Text>
                                }
                                wrapperProps={{
                                    onClick: () =>
                                        actaForm.setFieldValue(
                                            "legible",
                                            !legible
                                        ),
                                }}
                                {...actaForm.getInputProps("legible", {
                                    type: "checkbox",
                                })}
                                styles={{
                                    label: { cursor: "pointer" },
                                }}
                            />
                            <ThemeIcon
                                size="md"
                                radius="xl"
                                variant="filled"
                                color={legible ? "green" : "red"}
                            >
                                {legible ? (
                                    <IconCheck size={16} />
                                ) : (
                                    <IconX size={16} />
                                )}
                            </ThemeIcon>
                        </Group>
                    </Paper>

                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        style={{
                            backgroundColor: esCuadrada
                                ? "var(--mantine-color-green-0)"
                                : "var(--mantine-color-yellow-0)",
                            borderColor: esCuadrada
                                ? "var(--mantine-color-green-3)"
                                : "var(--mantine-color-yellow-3)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <Group justify="space-between" wrap="nowrap">
                            <Checkbox
                                disabled
                                label={
                                    <Text size="sm" fw={500}>
                                        Valores coinciden (cuadrada)
                                    </Text>
                                }
                                {...actaForm.getInputProps("cuadrada", {
                                    type: "checkbox",
                                })}
                            />
                            <ThemeIcon
                                size="md"
                                radius="xl"
                                variant="filled"
                                color={esCuadrada ? "green" : "yellow"}
                            >
                                {esCuadrada ? (
                                    <IconCheck size={16} />
                                ) : (
                                    <IconAlertCircle size={16} />
                                )}
                            </ThemeIcon>
                        </Group>
                    </Paper>
                </Stack>
            </Card>

            {/* Sección de Totales */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="sm" gap="xs">
                    <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="default"
                        color="blue"
                    >
                        <IconCalculator size={18} />
                    </ThemeIcon>
                    <div>
                        <Text fw={600} size="sm">
                            Resumen de Votos
                        </Text>
                        <Text size="xs" c="dimmed">
                            Verificación automática
                        </Text>
                    </div>
                </Group>

                <Divider mb="md" />

                <Grid gutter="sm">
                    <Grid.Col span={6}>
                        <Paper
                            p="md"
                            radius="md"
                            withBorder
                            style={{
                                backgroundColor: esCuadrada
                                    ? "var(--mantine-color-green-0)"
                                    : "var(--mantine-color-gray-0)",
                                borderColor: esCuadrada
                                    ? "var(--mantine-color-green-3)"
                                    : "var(--mantine-color-gray-3)",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <Group justify="space-between" mb={4}>
                                <Text
                                    size="xs"
                                    tt="uppercase"
                                    fw={700}
                                    c="dimmed"
                                >
                                    Total Huellas
                                </Text>
                                {esCuadrada && (
                                    <ThemeIcon
                                        size="xs"
                                        radius="xl"
                                        variant="filled"
                                        color="green"
                                    >
                                        <IconCheck size={10} />
                                    </ThemeIcon>
                                )}
                            </Group>
                            <Text
                                size="xl"
                                fw={700}
                                c={esCuadrada ? "green.7" : "dark"}
                            >
                                {votos_validos.toString()}
                            </Text>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Paper
                            p="md"
                            radius="md"
                            withBorder
                            style={{
                                backgroundColor: esCuadrada
                                    ? "var(--mantine-color-green-0)"
                                    : "var(--mantine-color-gray-0)",
                                borderColor: esCuadrada
                                    ? "var(--mantine-color-green-3)"
                                    : "var(--mantine-color-gray-3)",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <Group justify="space-between" mb={4}>
                                <Text
                                    size="xs"
                                    tt="uppercase"
                                    fw={700}
                                    c="dimmed"
                                >
                                    Total Votos
                                </Text>
                                {esCuadrada && (
                                    <ThemeIcon
                                        size="xs"
                                        radius="xl"
                                        variant="filled"
                                        color="green"
                                    >
                                        <IconCheck size={10} />
                                    </ThemeIcon>
                                )}
                            </Group>
                            <Text
                                size="xl"
                                fw={700}
                                c={esCuadrada ? "green.7" : "dark"}
                            >
                                {(
                                    votos_blancos +
                                    votos_nulos +
                                    parseInt(totales * 1)
                                ).toString()}
                            </Text>
                        </Paper>
                    </Grid.Col>
                </Grid>

                {!esCuadrada && (
                    <Paper
                        p="sm"
                        radius="md"
                        mt="sm"
                        bg="yellow.0"
                        style={{
                            borderLeft:
                                "3px solid var(--mantine-color-yellow-6)",
                        }}
                    >
                        <Group gap="xs">
                            <IconAlertCircle
                                size={16}
                                color="var(--mantine-color-yellow-7)"
                            />
                            <Text size="xs" fw={500} c="yellow.9">
                                Los totales no coinciden. Verifique los valores
                                ingresados.
                            </Text>
                        </Group>
                    </Paper>
                )}
            </Card>

            {/* Información del Usuario */}
            {(activateActa?.actualizador || activateActa?.creador) && (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group gap="xs" mb="sm">
                        <ThemeIcon
                            size="lg"
                            radius="md"
                            variant="default"
                            color="teal"
                        >
                            <IconUser size={18} />
                        </ThemeIcon>
                        <div>
                            <Text fw={600} size="sm">
                                Información de Registro
                            </Text>
                            <Text size="xs" c="dimmed">
                                Usuario responsable
                            </Text>
                        </div>
                    </Group>

                    <Divider mb="md" />

                    <Paper
                        p="md"
                        radius="md"
                        withBorder
                        bg="teal.0"
                        style={{ borderColor: "var(--mantine-color-teal-3)" }}
                    >
                        <Group justify="space-between" wrap="nowrap">
                            <Box>
                                <Badge
                                    size="sm"
                                    variant="light"
                                    color="teal"
                                    mb={6}
                                    leftSection={<IconFileCheck size={12} />}
                                >
                                    {activateActa?.actualizador
                                        ? "Actualizado"
                                        : "Creado"}
                                </Badge>
                                <Text size="sm" fw={600} c="teal.9">
                                    {activateActa?.actualizador ||
                                        activateActa?.creador}
                                </Text>
                            </Box>
                            <ThemeIcon
                                size="xl"
                                radius="xl"
                                variant="light"
                                color="teal"
                            >
                                <IconCheckbox size={24} />
                            </ThemeIcon>
                        </Group>
                    </Paper>
                </Card>
            )}

            {/* Acciones */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Grid gutter="md">
                    <Grid.Col span={3}>
                        <Tooltip
                            label="Reiniciar búsqueda"
                            position="top"
                            withArrow
                        >
                            <ActionIcon
                                mt={15}
                                variant="light"
                                color="gray"
                                radius="md"
                                size={50}
                                onClick={handleResetSearch}
                                style={{ width: "100%" }}
                            >
                                <IconRotate2 size={24} />
                            </ActionIcon>
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={9}>
                        <BtnSubmit heigh={50}>Ingresar Acta</BtnSubmit>
                    </Grid.Col>
                </Grid>
            </Card>
        </Stack>
    );
};
