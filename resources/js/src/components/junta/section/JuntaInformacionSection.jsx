import { Badge, Card, Group, ThemeIcon } from "@mantine/core";
import { IconChecks } from "@tabler/icons-react";
import { JuntaInformacionTable, TextSection } from "../../../components";

export const JuntaInformacionSection = () => {
    return (
        <Card shadow="sm" padding="md" radius="md" withBorder mb={20}>
            <Card.Section withBorder inheritPadding py="md" bg="dark.5">
                <Group justify="space-between">
                    <Group gap="sm">
                        <ThemeIcon size="md" radius="md" variant="default">
                            <IconChecks size={16} />
                        </ThemeIcon>
                        <div>
                            <TextSection color="white" fw={500} fz={18} tt="">
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
