import { Modal } from "@mantine/core";
import { ResultadosExportForm, TextSection } from "../../../components";
import { useDignidadStore, useResultadoStore, useUiResultado } from "../../../hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";

export const ResultadosExportModal = () => {
    const { startLoadDignidades, dignidades } = useDignidadStore();
    const { isOpenModalResultados, modalActionResultadosExport } =
        useUiResultado();
    const { startClearResultadosMap } = useResultadoStore();

    const form = useForm({
        initialValues: {
            dignidad_id: null,
            provincia_id: 8,
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor seleccione una dignidad"),
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || null,
        }),
    });

    useEffect(() => {
        if (isOpenModalResultados && dignidades.length === 0) {
            startLoadDignidades({ activo: true });
            return;
        }
    }, [isOpenModalResultados]);

    const handleCloseModal = () => {
        form.reset();
        modalActionResultadosExport();
        startClearResultadosMap();
    };

    return (
        <Modal
            centered
            opened={isOpenModalResultados}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fw={700} fz={16}>
                    ¡Exportar Resultados!
                </TextSection>
            }
            size="md"
            radius="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ResultadosExportForm form={form} />
        </Modal>
    );
};
