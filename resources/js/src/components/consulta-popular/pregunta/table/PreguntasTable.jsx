import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { ActivateBtn, TableContent, TableMenu } from "../../../../components";
import { usePreguntaStore, useUiPregunta } from "../../../../hooks";
import Swal from "sweetalert2";

export const PreguntasTable = ({ pagination, setPagination }) => {
    const {
        isLoading,
        preguntas,
        paginacion,
        setActivatePregunta,
        startDeletePregunta,
    } = usePreguntaStore();
    const { modalActionPregunta, modalActionStatusPregunta } = useUiPregunta();

    const columns = useMemo(
        () => [
            {
                header: "Casillero Pregunta",
                accessorKey: "casillero_pregunta",
                //filterVariant: "autocomplete",
            },
            {
                header: "Pregunta",
                accessorKey: "texto_pregunta",
                filterVariant: "autocomplete",
            },
            {
                header: "Descripcion",
                accessorKey: "descripcion",
                //filterVariant: "autocomplete",
            },
            {
                header: "Activo",
                accessorKey: "activo",
                Cell: ({ cell }) => (
                    <ActivateBtn cell={cell} handleActive={handleActive} />
                ),
            },
        ],
        []
    );

    const handleEdit = useCallback(
        (selected) => {
            setActivatePregunta(selected);
            modalActionPregunta(true);
        },
        [setActivatePregunta, modalActionPregunta]
    );

    const handleDelete = useCallback(
        (selected) => {
            setActivatePregunta(selected);
            Swal.fire({
                icon: "warning",
                text: `Estas seguro de eliminar ${selected.numero_pregunta}?`,
                showDenyButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Si",
                denyButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    startDeletePregunta(selected);
                }
            });
        },
        [setActivatePregunta, startDeletePregunta]
    );

    const handleActive = useCallback(
        (selected) => {
            setActivatePregunta(selected);
            modalActionStatusPregunta(true);
        },
        [setActivatePregunta, modalActionStatusPregunta]
    );

    const table = useMantineReactTable({
        columns,
        data: preguntas ?? [],
        state: {
            showProgressBars: isLoading,
            pagination, // Usamos el estado local
        },
        onPaginationChange: setPagination, // Actualiza el estado local
        rowCount: paginacion.total ?? 0,
        manualPagination: true,
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        renderRowActionMenuItems: ({ row }) => (
            <TableMenu
                row={row}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        ),
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
    });

    return <TableContent table={table} />;
};
