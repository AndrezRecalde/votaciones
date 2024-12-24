import { Modal } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { FormActivateElement, TextSection } from "../../../components";

export const ModalActivateElement = ({
    isOpenModal,
    modalAction,
    startAction,
    activateElement,
    setActivateElement,
}) => {
    const form = useForm({
        initialValues: {
            activo: null,
        },
        validate: {
            activo: isNotEmpty("Por favor ingrese un estado"),
        },
    });

    const handleCloseModal = () => {
        setActivateElement(null);
        form.reset();
        modalAction(false);
    };

    return (
        <Modal
            centered
            opened={isOpenModal}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fw={700} fz={16}>
                    Activar - Desactivar
                </TextSection>
            }
            size="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <FormActivateElement
                form={form}
                modalAction={modalAction}
                startAction={startAction}
                activateElement={activateElement}
            />
        </Modal>
    );
};
