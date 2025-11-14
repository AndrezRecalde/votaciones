import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { PreguntaForm, TextSection } from "../../../../components";
import { usePreguntaStore, useUiPregunta } from "../../../../hooks";

export const PreguntaModal = () => {
    const { setActivatePregunta } = usePreguntaStore();
    const { isOpenModalPregunta, modalActionPregunta } = useUiPregunta();

    const form = useForm({
        initialValues: {
            casillero_pregunta: "",
            texto_pregunta: "",
            descripcion: "",
        },
        validate: {
            casillero_pregunta: (value) =>
                value.length <= 0
                    ? "El casillero de pregunta es obligatorio"
                    : null,
            texto_pregunta: (value) =>
                value.length <= 0
                    ? "El texto de la pregunta es obligatorio"
                    : null,
        },
    });

    const handleCloseModal = () => {
        setActivatePregunta(null);
        form.reset();
        modalActionPregunta(false);
    };

    return (
        <Modal
            opened={isOpenModalPregunta}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Pregunta
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius="lg"
            size="lg"
        >
            <PreguntaForm form={form} />
        </Modal>
    );
};
