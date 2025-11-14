import {
    Paper,
    Text,
    Progress,
    Group,
    Stack,
    ThemeIcon,
    Box,
    Grid,
} from "@mantine/core";
import { IconFileCheck, IconFileX, IconFiles } from "@tabler/icons-react";
import { useEscrutinioConsultaStore } from "../../hooks";

export const ProfileProgressActasConsulta = () => {
    const { resumenGeneral } = useEscrutinioConsultaStore();

    // Validar que existan los datos
    if (!resumenGeneral) return null;

    const {
        total_juntas,
        total_juntas_con_acta,
        total_juntas_sin_acta,
        porcentaje_avance,
    } = resumenGeneral;

    // Calcular el porcentaje de juntas sin acta
    const porcentajeSinActa = 100 - porcentaje_avance;

    return (
        <Paper p="xl" radius="md" withBorder>
            <Stack gap="lg">
                {/* Header */}
                <Box>
                    <Text size="md" fw={700} mb={5}>
                        Progreso de Digitalización de Actas
                    </Text>
                    <Text size="xs" c="dimmed">
                        Seguimiento del proceso de registro de actas electorales
                    </Text>
                </Box>

                {/* Barra de Progreso Principal */}
                <Box>
                    <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>
                            Avance General
                        </Text>
                        <Text size="lg" fw={600} c="teal.6">
                            {porcentaje_avance.toFixed(2)}%
                        </Text>
                    </Group>

                    <Progress.Root size={32} radius="md">
                        <Progress.Section
                            value={porcentaje_avance}
                            color="teal.6"
                            style={{
                                background:
                                    "linear-gradient(90deg, #0ca678 0%, #12b886 100%)",
                            }}
                        >
                            <Progress.Label>
                                {porcentaje_avance > 5 &&
                                    `${porcentaje_avance.toFixed(1)}%`}
                            </Progress.Label>
                        </Progress.Section>
                        <Progress.Section
                            value={porcentajeSinActa}
                            color="gray.3"
                        >
                            <Progress.Label c="gray.7">
                                {porcentajeSinActa > 5 &&
                                    `${porcentajeSinActa.toFixed(1)}%`}
                            </Progress.Label>
                        </Progress.Section>
                    </Progress.Root>
                </Box>

                {/* Estadísticas Detalladas */}
                <Grid gutter="md">
                    {/* Total de Juntas */}
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Paper p="md" radius="md" withBorder>
                            <Group gap="sm">
                                <ThemeIcon
                                    size={48}
                                    radius="md"
                                    variant="light"
                                    color="blue.6"
                                >
                                    <IconFiles size={24} stroke={2} />
                                </ThemeIcon>
                                <Box style={{ flex: 1 }}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        tt="uppercase"
                                        fw={500}
                                    >
                                        Total Juntas
                                    </Text>
                                    <Text size="xl" fw={500}>
                                        {total_juntas.toLocaleString()}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>
                    </Grid.Col>

                    {/* Juntas con Acta */}
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Paper p="md" radius="md" withBorder>
                            <Group gap="sm">
                                <ThemeIcon
                                    size={48}
                                    radius="md"
                                    variant="light"
                                    color="teal.6"
                                >
                                    <IconFileCheck size={24} stroke={2} />
                                </ThemeIcon>
                                <Box style={{ flex: 1 }}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        tt="uppercase"
                                        fw={600}
                                    >
                                        Con Acta
                                    </Text>
                                    <Group gap="xs" align="baseline">
                                        <Text size="xl" fw={500} c="teal.6">
                                            {total_juntas_con_acta.toLocaleString()}
                                        </Text>
                                        <Text size="xs" c="teal.6" fw={500}>
                                            ({porcentaje_avance.toFixed(2)}%)
                                        </Text>
                                    </Group>
                                </Box>
                            </Group>
                        </Paper>
                    </Grid.Col>

                    {/* Juntas sin Acta */}
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Paper p="md" radius="md" withBorder>
                            <Group gap="sm">
                                <ThemeIcon
                                    size={48}
                                    radius="md"
                                    variant="light"
                                    color="red.6"
                                >
                                    <IconFileX size={24} stroke={2} />
                                </ThemeIcon>
                                <Box style={{ flex: 1 }}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        tt="uppercase"
                                        fw={600}
                                    >
                                        Sin Acta
                                    </Text>
                                    <Group gap="xs" align="baseline">
                                        <Text size="xl" fw={500} c="red.6">
                                            {total_juntas_sin_acta.toLocaleString()}
                                        </Text>
                                        <Text size="xs" c="red.6" fw={500}>
                                            ({porcentajeSinActa.toFixed(2)}%)
                                        </Text>
                                    </Group>
                                </Box>
                            </Group>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Paper>
    );
};
