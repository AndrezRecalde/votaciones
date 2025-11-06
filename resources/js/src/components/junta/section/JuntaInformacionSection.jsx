import { Badge, Card, Group, ThemeIcon } from "@mantine/core";
import { IconChecks } from "@tabler/icons-react";
import { JuntaInformacionTable, TextSection } from "../../../components";

export const JuntaInformacionSection = () => {
    return (
        <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
            <Card.Section withBorder inheritPadding py="xs" bg="dark.5">
                <Group justify="space-between">
                    <Group gap="xs">
                        <ThemeIcon size="md" radius="md" variant="default">
                            <IconChecks size={16} />
                        </ThemeIcon>
                        <div>
                            <TextSection color="white" fw={700} fz={18} tt="">
                                Detalles del Acta
                            </TextSection>
                        </div>
                    </Group>
                    <Badge
                        leftSection="🗳️"
                        size="lg"
                        radius="sm"
                        variant="default"
                    >
                        Consulta Popular 2025
                    </Badge>
                </Group>
            </Card.Section>
            <Card.Section>
                <JuntaInformacionTable />
            </Card.Section>
        </Card>
    );
};
