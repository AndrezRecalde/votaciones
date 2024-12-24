import { useMantineReactTable } from "mantine-react-table";
import { ActivateBtn, TableContent, TableMenu } from "../../../components";
import { useCallback, useMemo } from "react";
import { useGuessStore, useUiGuess } from "../../../hooks";
import Swal from "sweetalert2";

export const GuessTable = () => {
    const { isLoading, guesses, setActivateGuess, startDeleteGuess } =
        useGuessStore();
    const { modalActionGuess, modalActionStatusGuess } = useUiGuess();

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombres_completos", //access nested data with dot notation
                header: "Invitado",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "telefono", //access nested data with dot notation
                header: "Teléfono",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "codigo", //normal accessorKey
                header: "Código",
            },
            {
                accessorKey: "activo",
                header: "Activo",
                Cell: ({ cell }) => (
                    <ActivateBtn cell={cell} handleActive={handleActive} />
                ),
            },
        ],
        [guesses]
    );

    const handleEdit = useCallback(
        (selected) => {
            setActivateGuess(selected);
            modalActionGuess(true);
        },
        [guesses]
    );

    const handleDelete = useCallback(
        (selected) => {
            setActivateGuess(selected);
            Swal.fire({
                icon: "warning",
                text: `Estas seguro de eliminar ${selected.nombres_completos}?`,
                showDenyButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Si",
                denyButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    startDeleteGuess(selected);
                }
            });
        },
        [guesses]
    );

    const handleActive = useCallback(
        (selected) => {
            setActivateGuess(selected);
            modalActionStatusGuess(true);
        },
        [guesses]
    );

    const table = useMantineReactTable({
        columns,
        data: guesses, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
    });

    return <TableContent table={table} />;
};
