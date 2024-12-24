import { useMemo } from "react";
import { TableContent, TitlePage } from "../../../components";
import { useEscrutinioStore } from "../../../hooks";
import { useMantineReactTable } from "mantine-react-table";

export const EscrutinioTable = () => {
    const { resultadosEscrutinio } = useEscrutinioStore();

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombre_canton",
                header: "Cantón",
            },
            {
                accessorFn: (row) => row.nombre_dignidad.toUpperCase(),
                header: "Dignidad",
            },
            {
                accessorKey: "ingresadas",
                header: "Actas Ingresadas",
            },
            {
                accessorKey: "total",
                header: "Total Juntas",
            },
            {
                accessorFn: (row) =>
                    ((row.ingresadas * 100) / row.total).toFixed(2) + " %",
                header: "Porcentaje",
            },
        ],
        [resultadosEscrutinio]
    );

    const table = useMantineReactTable({
        columns,
        data: resultadosEscrutinio,
        mantineTableProps: {
            highlightOnHover: false,
            withColumnBorders: true,
            //withBorder: colorScheme === "light",
        },
        renderTopToolbarCustomActions: () => {
            return <TitlePage order={3}>Avance de Escrutinio</TitlePage>;
        },
        initialState: { pagination: { pageSize: 50, pageIndex: 0 } },
        rowsPerPageOptions: ["8", "18"],
    });

    return <TableContent table={table} />;
};
