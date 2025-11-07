import {
    Badge,
    Box,
    Card,
    Divider,
    Group,
    Paper,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { IconCheckbox, IconFileCheck, IconUser } from "@tabler/icons-react";

export const ActaInformacionUsuario = ({ existeActaConsulta, pregunta }) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="xs" mb="sm">
                <ThemeIcon size="lg" radius="md" variant="default" color="teal">
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
                bg={existeActaConsulta ? "teal.0" : "gray.0"}
                style={{
                    borderColor: existeActaConsulta
                        ? "var(--mantine-color-teal-3)"
                        : "var(--mantine-color-gray-3)",
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Box>
                        <Badge
                            size="sm"
                            variant="light"
                            color={existeActaConsulta ? "teal" : "gray"}
                            mb={6}
                            leftSection={<IconFileCheck size={12} />}
                        >
                            {pregunta?.user_update
                                ? "Actualizado"
                                : pregunta?.user_add
                                ? "Creado"
                                : "Acta sin registrar"}
                        </Badge>
                        <Text size="sm" fw={600} c="teal.9">
                            {pregunta?.user_update ||
                                pregunta?.user_add ||
                                "Acta sin registrar"}
                        </Text>
                    </Box>
                    <ThemeIcon
                        size="xl"
                        radius="xl"
                        variant="light"
                        color={existeActaConsulta ? "teal" : "gray"}
                    >
                        <IconCheckbox size={24} />
                    </ThemeIcon>
                </Group>
            </Paper>
        </Card>
    );
};
