import { useState } from "react";
import {
    Card,
    Divider,
    Grid,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCalculator,
    IconCheck,
} from "@tabler/icons-react";

export const ActaResumenTotalVotos = () => {
    const [totales, setTotales] = useState(0);
    const esCuadrada = true; // Placeholder value
    const votos_validos = 100;
    const votos_blancos = 5;
    const votos_nulos = 3;

    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group mb="sm" gap="xs">
                <ThemeIcon size="lg" radius="md" variant="default" color="blue">
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

            <Stack>
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
                    <Group justify="space-between">
                        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
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
                    <Group justify="space-between">
                        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
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
            </Stack>

            {!esCuadrada && (
                <Paper
                    p="sm"
                    radius="md"
                    mt="sm"
                    bg="yellow.0"
                    style={{
                        borderLeft: "3px solid var(--mantine-color-yellow-6)",
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
    );
};
