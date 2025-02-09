import { Badge, Card, Group, SimpleGrid } from "@mantine/core";
import { useActaStore } from "../../hooks";
import { TextSection, TitlePage } from "../../components";

export const ActaCardInfo = () => {
    const { activateJunta, activateActa } = useActaStore();

    return (
        <Card withBorder shadow="sm" radius="md" mb="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <TitlePage order={5} ta="left">
                        {activateJunta?.recinto}
                    </TitlePage>
                    <Badge color="indigo.7" radius="sm">
                        {activateJunta?.junta}
                    </Badge>
                </Group>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
                <SimpleGrid cols={2} mt={20}>
                    <div>
                        <TextSection
                            tt="uppercase"
                            fz={12}
                            fw={600}
                            color="dimmed"
                            ta="center"
                        >
                            ACTA N°
                        </TextSection>
                        <TextSection tt="" fw={700} fz={14} ta="center">
                            {activateActa !== null
                                ? activateActa?.id
                                : "[AUTO]"}
                        </TextSection>
                    </div>
                    <div>
                        <TextSection
                            tt="uppercase"
                            fz={12}
                            fw={600}
                            color="dimmed"
                            ta="center"
                        >
                            ZONA
                        </TextSection>
                        <TextSection tt="" fw={700} fz={14} ta="center">
                            {activateJunta?.zona}
                        </TextSection>
                    </div>
                </SimpleGrid>
                <SimpleGrid cols={3} mt={20}>
                    <div>
                        <TextSection
                            tt="uppercase"
                            fz={12}
                            fw={600}
                            color="dimmed"
                            ta="center"
                        >
                            PROVINCIA
                        </TextSection>
                        <TextSection tt="uppercase" fw={700} fz={14} ta="center">
                            {activateJunta?.provincia}
                        </TextSection>
                    </div>
                    <div>
                        <TextSection
                            tt="uppercase"
                            fz={12}
                            fw={600}
                            color="dimmed"
                            ta="center"
                        >
                            CANTÓN
                        </TextSection>
                        <TextSection tt="" fw={700} fz={14} ta="center">
                            {activateJunta?.canton}
                        </TextSection>
                    </div>
                    <div>
                        <TextSection
                            tt="uppercase"
                            fz={12}
                            fw={600}
                            color="dimmed"
                            ta="center"
                        >
                            PARROQUIA
                        </TextSection>
                        <TextSection tt="" fw={700} fz={14} ta="center">
                            {activateJunta?.parroquia}
                        </TextSection>
                    </div>
                </SimpleGrid>
            </Card.Section>
        </Card>
    );
};
