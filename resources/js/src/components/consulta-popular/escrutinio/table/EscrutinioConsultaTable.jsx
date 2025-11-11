import { useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { useEscrutinioConsultaStore } from "../../../../hooks/consulta/escrutinio-consulta/useEscrutinioConsultaStore";
import { TableContent, TitlePage } from "../../../../components";

export const EscrutinioConsultaTable = () => {
    const { escrutinioConsulta } = useEscrutinioConsultaStore();

    const { items } = escrutinioConsulta;

    const resultadosEscrutinio = items || [];

    const columns = useMemo(
        () => [
            {
                accessorKey: "canton",
                header: "Cantón",
            },
            {
                accessorKey: "actas_ingresadas",
                header: "Actas Ingresadas",
            },
            {
                accessorKey: "total_juntas",
                header: "Total Juntas",
            },
            {
                accessorKey: "porcentaje_avance",
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
