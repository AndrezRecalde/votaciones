import { useEffect } from "react";
import {
    Card,
    Checkbox,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";

export const ActaValidacionSection = ({ actaForm, esCuadrada, legible }) => {
    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
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
                            ? "var(--mantine-color-teal-0)"
                            : "var(--mantine-color-red-0)",
                        borderColor: legible
                            ? "var(--mantine-color-teal-3)"
                            : "var(--mantine-color-red-3)",
                        transition: "all 0.2s ease",
                    }}
                >
                    <Group justify="space-between" wrap="nowrap">
                        <Checkbox
                            color="teal"
                            label={
                                <Text size="sm" fw={500}>
                                    Acta legible y clara
                                </Text>
                            }
                            wrapperProps={{
                                onClick: () =>
                                    actaForm.setFieldValue("legible", !legible),
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
                            color={legible ? "teal" : "red"}
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
                            ? "var(--mantine-color-teal-0)"
                            : "var(--mantine-color-yellow-0)",
                        borderColor: esCuadrada
                            ? "var(--mantine-color-teal-3)"
                            : "var(--mantine-color-yellow-3)",
                        transition: "all 0.2s ease",
                    }}
                >
                    <Group justify="space-between" wrap="nowrap">
                        <Checkbox
                            color="teal"
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
                            color={esCuadrada ? "teal" : "yellow"}
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
    );
};
