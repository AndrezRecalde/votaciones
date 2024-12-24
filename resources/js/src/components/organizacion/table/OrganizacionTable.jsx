import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { TableContent, TableMenu } from "../../../components";
import { useOrganizacionStore, useUiOrganizacion } from "../../../hooks";
import Swal from "sweetalert2";
import { Avatar, Image } from "@mantine/core";

export const OrganizacionTable = () => {
    const {
        isLoading,
        organizaciones,
        setActivateOrganizacion,
        startDeleteOrganizacion,
    } = useOrganizacionStore();

    const { modalActionOrganizacion } = useUiOrganizacion();

    const columns = useMemo(
        () => [
            {
                id: "numero_organizacion", //normal accessorKey
                accessorFn: (row) => row.numero_organizacion + " " + row.sigla, //access nested data with dot notation
                header: "Lista",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "nombre_organizacion", //access nested data with dot notation
                header: "Organización",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "logo_url",
                id: "logo_url",
                header: "Logo",
                wrap: true,
                Cell: ({ cell }) => (
                    <Image
                        radius="md"
                        h={50}
                        w="auto"
                        fit="contain"
                        src={`/storage${cell.getValue()}`}
                    />
                ),
            },
        ],
        [organizaciones]
    );

    const handleEdit = useCallback(
        (selected) => {
            setActivateOrganizacion(selected);
            modalActionOrganizacion(true);
        },
        [organizaciones]
    );

    const handleDelete = useCallback(
        (selected) => {
            setActivateCandidato(selected);
            Swal.fire({
                icon: "warning",
                text: `Estas seguro de eliminar ${selected.nombre_candidato}?`,
                showDenyButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Si",
                denyButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    startDeleteOrganizacion(selected);
                }
            });
        },
        [organizaciones]
    );

    const table = useMantineReactTable({
        columns,
        data: organizaciones, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableFacetedValues: true,
        enableRowActions: true,
        state: { showProgressBars: isLoading },
        renderRowActionMenuItems: ({ row }) => (
            <TableMenu
                row={row}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
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
                column.id === "numero_organizacion"
                    ? {
                          backgroundColor: cell.row.original.color,
                          color: "white",
                      }
                    : {},
        }),
    });

    return <TableContent table={table} />;
};
