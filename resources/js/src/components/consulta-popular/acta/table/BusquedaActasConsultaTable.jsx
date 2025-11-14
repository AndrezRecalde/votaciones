import { useMemo } from "react";
import { Box, Stack, Text, Table, Badge, Group } from "@mantine/core";
import { useMantineReactTable } from "mantine-react-table";
import { TableContent } from "../../../../components";
import { useActaConsultaStore } from "../../../../hooks";

export const BusquedaActasConsultaTable = () => {
    const {
        isLoading,
        actasConsulta,
        actasPaginacion,
        ultimosFiltros,
        setActasPagina,
    } = useActaConsultaStore();

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombres.canton",
                header: "Cantón",
                size: 150,
            },
            {
                accessorKey: "nombres.parroquia",
                header: "Parroquia",
                size: 150,
            },
            {
                accessorKey: "nombres.zona",
                header: "Zona",
                size: 150,
            },
            {
                accessorKey: "nombres.recinto",
                header: "Recinto",
                size: 200,
            },
            {
                accessorKey: "nombres.junta",
                header: "Junta",
                size: 200,
            },
            {
                accessorKey: "cod_cne",
                header: "Código CNE",
                size: 150,
            },
        ],
        []
    );

    const renderDetailPanel = ({ row }) => {
        const acta = row.original;

        return (
            <Box p="md" style={{ backgroundColor: "#f8f9fa" }}>
                <Stack gap="lg">
                    {/* Primera tabla: Información del acta */}
                    <Box>
                        <Text fw={600} size="sm" mb="xs">
                            Información del Acta
                        </Text>
                        <Table
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Votos Válidos</Table.Th>
                                    <Table.Th>Cuadrada</Table.Th>
                                    <Table.Th>Legible</Table.Th>
                                    <Table.Th>Usuario</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>
                                        <Text fw={600}>
                                            {acta.votos_validos?.toLocaleString()}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            radius="xs"
                                            color={
                                                acta.cuadrada ? "green" : "red"
                                            }
                                        >
                                            {acta.cuadrada ? "SÍ" : "NO"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            radius="xs"
                                            color={
                                                acta.legible ? "green" : "red"
                                            }
                                        >
                                            {acta.legible ? "SÍ" : "NO"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">
                                            {acta.user_update || acta.user_add}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Box>

                    {/* Segunda tabla: Preguntas y votos */}
                    {acta.preguntas && acta.preguntas.length > 0 && (
                        <Box>
                            <Text fw={600} size="sm" mb="xs">
                                Resultados por Pregunta
                            </Text>
                            <Table
                                striped
                                highlightOnHover
                                withTableBorder
                                withColumnBorders
                                style={{ fontSize: "0.875rem" }}
                            >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th style={{ width: "60px" }}>
                                            Casillero
                                        </Table.Th>
                                        <Table.Th>Pregunta</Table.Th>
                                        <Table.Th
                                            style={{
                                                width: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Votos SÍ
                                        </Table.Th>
                                        <Table.Th
                                            style={{
                                                width: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Votos NO
                                        </Table.Th>
                                        <Table.Th
                                            style={{
                                                width: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Blancos
                                        </Table.Th>
                                        <Table.Th
                                            style={{
                                                width: "100px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Nulos
                                        </Table.Th>
                                        <Table.Th
                                            style={{
                                                width: "120px",
                                                textAlign: "center",
                                            }}
                                        >
                                            % SÍ / NO
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {acta.preguntas.map((pregunta) => (
                                        <Table.Tr
                                            key={
                                                pregunta.acta_consulta_pregunta_id
                                            }
                                        >
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                {pregunta.casillero}
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {pregunta.texto_pregunta}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                <Text fw={600} c="green">
                                                    {pregunta.votos_si?.toLocaleString()}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                <Text fw={600} c="red">
                                                    {pregunta.votos_no?.toLocaleString()}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                <Text>
                                                    {pregunta.votos_blancos?.toLocaleString()}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                <Text>
                                                    {pregunta.votos_nulos?.toLocaleString()}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td
                                                style={{ textAlign: "center" }}
                                            >
                                                <Group gap={4} justify="center">
                                                    <Text
                                                        size="sm"
                                                        fw={600}
                                                        c="green"
                                                    >
                                                        {pregunta.porcentaje_si?.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </Text>
                                                    <Text size="sm">/</Text>
                                                    <Text
                                                        size="sm"
                                                        fw={600}
                                                        c="red"
                                                    >
                                                        {pregunta.porcentaje_no?.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </Text>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Box>
                    )}
                </Stack>
            </Box>
        );
    };

    const table = useMantineReactTable({
        columns,
        data: actasConsulta || [],
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowSelection: false,
        enableExpanding: true,
        initialState: {
            density: "xs",
            expanded: false,
            pagination: {
                pageIndex: (actasPaginacion?.pagina_actual || 1) - 1,
                pageSize: actasPaginacion?.por_pagina || 15,
            },
        },
        mantineToolbarAlertBannerProps: isLoading
            ? {
                  color: "blue",
                  children: "Cargando datos...",
              }
            : undefined,

        mantineTableProps: {
            withColumnBorders: true,
            striped: true,
            withTableBorder: true,
            sx: {
                "thead > tr": {
                    backgroundColor: "inherit",
                },
                "thead > tr > th": {
                    backgroundColor: "inherit",
                },
                "tbody > tr > td": {
                    backgroundColor: "inherit",
                },
            },
        },
        renderDetailPanel,
        manualPagination: true,
        rowCount: actasPaginacion?.total || 0,
        pageCount: actasPaginacion?.ultima_pagina || 1,
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                const newPagination = updater({
                    pageIndex: (actasPaginacion?.pagina_actual || 1) - 1,
                    pageSize: actasPaginacion?.por_pagina || 15,
                });
                // Llamar a la función que actualizará la página en tu store
                if (setActasPagina) {
                    setActasPagina(newPagination.pageIndex + 1);
                }
            }
        },
        state: {
            isLoading,
            pagination: {
                pageIndex: (actasPaginacion?.pagina_actual || 1) - 1,
                pageSize: actasPaginacion?.por_pagina || 15,
            },
        },
    });

    return <TableContent table={table} />;
};
