import { useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { TableContent, TextSection, TitlePage } from "../../../../components";
import { useResultadoConsultaStore } from "../../../../hooks";

export const ResultadosConsultaTable = () => {
    const { isLoading, resultados } = useResultadoConsultaStore();
    const columns = useMemo(
        () => [
            {
                id: "Casillero o Pregunta", //normal accessorKey
                accessorFn: (row) => (
                    <TextSection fz={22} fw={700} fs="italic">
                        {row.casillero_pregunta}
                    </TextSection>
                ),
                header: "Casillero o Pregunta",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "texto_pregunta",
                header: "Pregunta",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "porcentaje_si",
                accessorFn: (row) => (
                    <TextSection fz={18} fw={700} fs="italic">
                        {row.porcentaje_si} %
                    </TextSection>
                ),
                header: "Total Votos (SI)",
                filterVariant: "autocomplete",
                mantineTableBodyCellProps: ({ row }) => ({
                    style: {
                        backgroundColor:
                            row.original.porcentaje_si >
                            row.original.porcentaje_no
                                ? "#B3D9FF" // Azul pastel
                                : "inherit",
                    },
                }),
            },
            {
                accessorKey: "porcentaje_no",
                accessorFn: (row) => (
                    <TextSection fz={18} fw={700} fs="italic">
                        {row.porcentaje_no} %
                    </TextSection>
                ),
                header: "Total Votos (NO)",
                filterVariant: "autocomplete",
                mantineTableBodyCellProps: ({ row }) => ({
                    style: {
                        backgroundColor:
                            row.original.porcentaje_no >
                            row.original.porcentaje_si
                                ? "#FFB3B3" // Rojo pastel
                                : "inherit",
                    },
                }),
            },
        ],
        [resultados]
    );
    const table = useMantineReactTable({
        columns,
        data: resultados,
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
                TOTAL DE VOTOS REFERENDUM/CONSULTA POPULAR
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
    });

    return <TableContent table={table} />;
};
