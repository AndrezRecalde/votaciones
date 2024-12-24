import { useMemo } from "react";
import { TableContent, TitlePage } from "../../../components";
import { Table } from "@mantine/core";
import { useActaStore } from "../../../hooks";
import { useMantineReactTable } from "mantine-react-table";

export const BusquedaActaTable = () => {
    const { isLoading, actas } = useActaStore();
    const columns = useMemo(
        () => [
            {
                accessorKey: "nombre_canton", //access nested data with dot notation
                header: "Cantón",
            },
            {
                accessorKey: "nombre_parroquia",
                header: "Parroquia",
            },
            {
                accessorKey: "nombre_zona", //normal accessorKey
                header: "Zona",
            },
            {
                accessorKey: "nombre_recinto",
                header: "Recinto",
            },
            {
                accessorKey: "junta_nombre",
                header: "Junta",
            },
        ],
        []
    );

    const table = useMantineReactTable({
        columns,
        data: actas, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        mantineTableProps: {
            highlightOnHover: false,
            withColumnBorders: true,
            //withBorder: colorScheme === "light",
            state: { showProgressBars: isLoading },
        },
        renderTopToolbarCustomActions: () => {
            return (
                <TitlePage order={4}>
                    Resultados de las Actas Ingresadas
                </TitlePage>
            );
        },
        renderDetailPanel: ({ row }) => (
            <Table horizontalSpacing="lg" withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Total Huellas</Table.Th>
                        <Table.Th>Votos Blancos</Table.Th>
                        <Table.Th>Votos Nulos</Table.Th>
                        <Table.Th>¿Consistente?</Table.Th>
                        <Table.Th>Responsable</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr key={row.original.id}>
                        <Table.Td>{row.original.votos_validos}</Table.Td>
                        <Table.Td>{row.original.votos_blancos}</Table.Td>
                        <Table.Td>{row.original.votos_nulos}</Table.Td>
                        <Table.Td>
                            {row.original.cuadrada === 0
                                ? "Inconsistente"
                                : "Consistente"}
                        </Table.Td>
                        <Table.Td>{row.original.nombres_completos}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        ),
    });

    return <TableContent table={table} />;
};
