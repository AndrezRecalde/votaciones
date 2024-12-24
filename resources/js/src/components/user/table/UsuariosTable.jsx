import { useCallback, useMemo } from "react";
import { ActivateBtn, TableContent, TableMenu } from "../../../components";
import { useMantineReactTable } from "mantine-react-table";
import { useUiUsuario, useUsuarioStore } from "../../../hooks";
import Swal from "sweetalert2";

export const UsuariosTable = () => {
    const { isLoading, usuarios, setActivateUsuario, startDeleteUsuario } = useUsuarioStore();
    const {
        modalActionUsuario,
        modalActionStatusUsuario,
        modalActionPwdUsuario,
    } = useUiUsuario();

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombres_completos", //access nested data with dot notation
                header: "Nombres",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "dni", //access nested data with dot notation
                header: "Cédula",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "nombre_provincia", //normal accessorKey
                header: "Provincia",
            },
            {
                accessorFn: (row) => row.nombre_canton || "NIVEL PROVINCIAL",
                header: "Cantón",
            },
            {
                accessorKey: "role",
                header: "Role",
            },
            {
                accessorKey: "activo",
                header: "Activo",
                Cell: ({ cell }) => (
                    <ActivateBtn cell={cell} handleActive={handleActive} />
                ),
            },
        ],
        []
    );

    const handleEdit = useCallback(
        (selected) => {
            //console.log(selected)
            setActivateUsuario(selected);
            modalActionUsuario(true, true);
        },
        [usuarios]
    );

    const handleDelete = useCallback(
        (selected) => {
            setActivateUsuario(selected);
            Swal.fire({
                icon: "warning",
                text: `Estas seguro de eliminar ${selected.nombres_completos}?`,
                showDenyButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Si",
                denyButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    startDeleteUsuario(selected);
                }
            });
        },
        [usuarios]
    );

    const handleActive = useCallback(
        (selected) => {
            setActivateUsuario(selected);
            modalActionStatusUsuario(true);
        },
        [usuarios]
    );

    const handleResetPassword = useCallback(
        (selected) => {
            setActivateUsuario(selected);
            modalActionPwdUsuario(true);
        },
        [usuarios]
    );

    const table = useMantineReactTable({
        columns,
        data: usuarios, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableFacetedValues: true,
        enableRowActions: true,
        state: { showProgressBars: isLoading },
        renderRowActionMenuItems: ({ row }) => (
            <TableMenu
                row={row}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleResetPassword={handleResetPassword}
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
    });

    return <TableContent table={table} />;
};
