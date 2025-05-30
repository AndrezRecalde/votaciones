import { useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { TableContent, TextSection, TitlePage } from "../../components";
import { useResultadoStore } from "../../hooks";

export const TableResultado = () => {
    const { isLoading, resultadoCandidatos, totalDeVotos } =
        useResultadoStore();

    const columns = useMemo(
        () => [
            {
                id: "numero_organizacion", //normal accessorKey
                accessorFn: (row) => row.nombre_organizacion + " - " + row.numero_organizacion, //access nested data with dot notation
                header: "Lista",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "nombre_candidato", //access nested data with dot notation
                header: "Candidato",
                filterVariant: "autocomplete",
            },
            {
                accessorFn: (row) => (
                    <TextSection fz={18} fw={700} fs="italic">
                        {row.total_votos}
                    </TextSection>
                ), //access nested data with dot notation
                header: "Total Votos",
                filterVariant: "autocomplete",
            },
            {
                accessorFn: (row) => (
                    <TextSection fz={18} fw={700} fs="italic">
                        {totalDeVotos?.total_votos_validos > 0
                        ? (
                              (row?.total_votos * 100) /
                              totalDeVotos?.total_votos_validos
                          ).toFixed(2) + " %"
                        : "0 %"}
                    </TextSection>
                ), //access nested data with dot notation
                header: "Porcentaje",
                filterVariant: "autocomplete",
            },
        ],
        [resultadoCandidatos]
    );

    const table = useMantineReactTable({
        columns,
        data: resultadoCandidatos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableFacetedValues: false,
        enableRowActions: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableFilters: false,
        enableDensityToggle: false,
        enablePagination: false,
        enableSorting: false,
        enableHiding: false,
        enableFullScreenToggle: false,
        state: { showProgressBars: isLoading },
        renderTopToolbarCustomActions: ({ table }) => (
            <TitlePage order={5} ta="left">
                TOTAL DE VOTOS POR CANDIDATOS
            </TitlePage>
        ),
        mantineTableProps: {
            withColumnBorders: true,
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
        mantineTableBodyCellProps: ({ column, cell }) => ({
            style:
                cell.row.index < 3 // Solo aplica estilo a la primera fila
                    ? {
                          backgroundColor: cell.row.original.color,
                          color: "black",
                      }
                    : {},
        }),
    });

    return <TableContent table={table} />;
};
