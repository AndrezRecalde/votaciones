import { Modal } from "@mantine/core";
import { ResultadosExportFormXLS, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDignidadStore, useUiResultado } from "../../../hooks";
import { useEffect } from "react";

export const ResultadosExportModalXLS = () => {
    const { startLoadDignidades, dignidades } = useDignidadStore();
    const { isOpenModalResultadosXLS, modalActionResultadosExportXLS } =
        useUiResultado();

    const form = useForm({
        initialValues: {
            dignidad_id: null,
            //provincia_id: 8,
        },
        validate: {
            dignidad_id: isNotEmpty("Por favor seleccione una dignidad"),
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || null,
        }),
    });

    useEffect(() => {
        if (isOpenModalResultadosXLS && dignidades.length === 0) {
            startLoadDignidades({ activo: true });
            return;
        }
    }, [isOpenModalResultadosXLS]);

    const handleCloseModal = () => {
        form.reset();
        modalActionResultadosExportXLS();
        //startClearResultadosMap();
    };

    return (
        <Modal
            centered
            opened={isOpenModalResultadosXLS}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fw={700} fz={16}>
                    ¡Exportar Resultados en Excel!
                </TextSection>
            }
            size="md"
            radius="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ResultadosExportFormXLS form={form} />
        </Modal>
    );
};
