import { Badge, Card, Group, Table } from "@mantine/core";
import { TitlePage } from "../../../components";
import { useActaConsultaStore } from "../../../hooks";
import classes from "../../../assets/styles/modules/digitacion/ActaCardInfo.module.css";

export const JuntaInformacionTable = () => {
    const { juntaInfo, pregunta } = useActaConsultaStore();

    return (
        <Card shadow="sm" radius="md" padding={0}>
            <Card.Section withBorder inheritPadding py="md" px="md" bg="gray.0">
                <Group justify="space-between" align="center">
                    <TitlePage order={6} ta="left" mb={0}>
                        {juntaInfo?.nombres?.recinto}
                    </TitlePage>
                    <Badge
                        color="indigo.7"
                        radius="sm"
                        size="md"
                        variant="filled"
                    >
                        {juntaInfo?.nombres?.junta}
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
                                {pregunta?.id !== null
                                    ? pregunta?.id
                                    : "[AUTO]"}
                            </Table.Td>
                            <Table.Td data-label="Zona">
                                {juntaInfo?.nombres?.zona}
                            </Table.Td>
                            <Table.Td
                                data-label="Provincia"
                                className={classes.uppercase}
                            >
                                {juntaInfo?.nombres?.provincia}
                            </Table.Td>
                            <Table.Td data-label="Cantón">
                                {juntaInfo?.nombres?.canton}
                            </Table.Td>
                            <Table.Td data-label="Parroquia">
                                {juntaInfo?.nombres?.parroquia}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Card.Section>
        </Card>
    );
};
