import { Badge, Card, Group, Table } from "@mantine/core";
import { TextSection } from "../../../components";
import { useActaConsultaStore } from "../../../hooks";
import classes from "../../../assets/styles/modules/digitacion/ActaCardInfo.module.css";

export const JuntaInformacionTable = () => {
    const { juntaInfo, info_acta } = useActaConsultaStore();

    return (
        <Card shadow="sm" radius="md" padding={0}>
            <Card.Section withBorder inheritPadding py="sm" px="sm" bg="gray.0">
                <Group justify="space-between" align="center">
                    <TextSection fw={600} fz={14} tt="uppercase">
                        {juntaInfo?.nombres?.recinto}
                    </TextSection>

                    <Badge
                        color="#0ae98a"
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
                                {info_acta?.acta_id !== null
                                    ? info_acta?.acta_id
                                    : "[AUTO]"}
                            </Table.Td>
                            <Table.Td
                                data-label="Zona"
                                className={classes.uppercase}
                            >
                                {juntaInfo?.nombres?.zona}
                            </Table.Td>
                            <Table.Td
                                data-label="Provincia"
                                className={classes.uppercase}
                            >
                                {juntaInfo?.nombres?.provincia}
                            </Table.Td>
                            <Table.Td
                                data-label="Cantón"
                                className={classes.uppercase}
                            >
                                {juntaInfo?.nombres?.canton}
                            </Table.Td>
                            <Table.Td
                                data-label="Parroquia"
                                className={classes.uppercase}
                            >
                                {juntaInfo?.nombres?.parroquia}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Card.Section>
        </Card>
    );
};
