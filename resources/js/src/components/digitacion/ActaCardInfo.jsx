import { Badge, Card, Group, Table } from "@mantine/core";
import { useActaStore } from "../../hooks";
import { TitlePage } from "../../components";
import classes from '../../assets/styles/modules/digitacion/ActaCardInfo.module.css';

export const ActaCardInfo = () => {
    const { activateJunta, activateActa } = useActaStore();

    return (
        <Card
            shadow="sm"
            radius="md"
            padding={0}
        >
            <Card.Section
                withBorder
                inheritPadding
                py="md"
                px="md"
                bg="gray.0"
            >
                <Group justify="space-between" align="center">
                    <TitlePage order={6} ta="left" mb={0}>
                        {activateJunta?.recinto}
                    </TitlePage>
                    <Badge
                        color="indigo.7"
                        radius="sm"
                        size="md"
                        variant="filled"
                    >
                        {activateJunta?.junta}
                    </Badge>
                </Group>
            </Card.Section>

            <Card.Section>
                <Table
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    withTableBorder={false}
                    withColumnBorders
                    className={classes.responsiveTable}
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Acta N°</Table.Th>
                            <Table.Th>Zona</Table.Th>
                            <Table.Th>Provincia</Table.Th>
                            <Table.Th>Cantón</Table.Th>
                            <Table.Th>Parroquia</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td data-label="Acta N°">
                                {activateActa !== null ? activateActa?.id : "[AUTO]"}
                            </Table.Td>
                            <Table.Td data-label="Zona">
                                {activateJunta?.zona}
                            </Table.Td>
                            <Table.Td data-label="Provincia" className={classes.uppercase}>
                                {activateJunta?.provincia}
                            </Table.Td>
                            <Table.Td data-label="Cantón">
                                {activateJunta?.canton}
                            </Table.Td>
                            <Table.Td data-label="Parroquia">
                                {activateJunta?.parroquia}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Card.Section>
        </Card>
    );
};
