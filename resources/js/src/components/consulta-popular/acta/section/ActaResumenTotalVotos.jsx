import {
    Card,
    Divider,
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

export const ActaResumenTotalVotos = ({
    esCuadrada,
    votos_validos,
    totales,
}) => {
    console.log(esCuadrada);
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
                            ? "var(--mantine-color-teal-0)"
                            : "var(--mantine-color-yellow-0)",
                        borderColor: esCuadrada
                            ? "var(--mantine-color-teal-3)"
                            : "var(--mantine-color-yellow-3)",
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
                                color="teal"
                            >
                                <IconCheck size={10} />
                            </ThemeIcon>
                        )}
                    </Group>
                    <Text
                        size="lg"
                        fw={700}
                        c={esCuadrada ? "teal.7" : "dark"}
                    >
                        {votos_validos.toString() || "0"}
                    </Text>
                </Paper>

                <Paper
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                        backgroundColor: esCuadrada
                            ? "var(--mantine-color-teal-0)"
                            : "var(--mantine-color-yellow-0)",
                        borderColor: esCuadrada
                            ? "var(--mantine-color-teal-3)"
                            : "var(--mantine-color-yellow-3)",
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
                                color="teal"
                            >
                                <IconCheck size={10} />
                            </ThemeIcon>
                        )}
                    </Group>
                    <Text
                        size="lg"
                        fw={700}
                        c={esCuadrada ? "teal.7" : "dark"}
                    >
                        {totales.total.toString() || "0"}
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
