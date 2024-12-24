import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { ActivateBtn, TableContent, TableMenu } from "../../../components";
import { useCandidatoStore, useUiCandidato } from "../../../hooks";
import Swal from "sweetalert2";

export const CandidatoTable = () => {
    const {
        isLoading,
        candidatos,
        setActivateCandidato,
        startDeleteCandidato,
    } = useCandidatoStore();
    const { modalActionCandidato, modalActionStatusCandidato } =
        useUiCandidato();

    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => row.numero_organizacion + " " +row.sigla, //access nested data with dot notation
                header: "Lista",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "nombre_candidato", //access nested data with dot notation
                header: "Candidatos",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "nombre_organizacion", //access nested data with dot notation
                header: "Organización",
                filterVariant: "autocomplete",
            },
            {
                accessorKey: "nombre_dignidad", //normal accessorKey
                header: "Dignidad",
            },
            {
                accessorKey: "activo",
                header: "Activo",
                Cell: ({ cell }) => (
                    <ActivateBtn cell={cell} handleActive={handleActive} />
                ),
            },
        ],
        [candidatos]
    );

    const handleEdit = useCallback(
        (selected) => {
            setActivateCandidato(selected);
            modalActionCandidato(true);
        },
        [candidatos]
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
                    startDeleteCandidato(selected);
                }
            });
        },
        [candidatos]
    );

    const handleActive = useCallback(
        (selected) => {
            setActivateCandidato(selected);
            modalActionStatusCandidato(true);
        },
        [candidatos]
    );

    const table = useMantineReactTable({
        columns,
        data: candidatos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
