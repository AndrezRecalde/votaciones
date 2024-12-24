import { Modal } from "@mantine/core";
import { GuessForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useGuessStore, useUiGuess } from "../../../hooks";

export const GuessModal = () => {

    const { setActivateGuess } = useGuessStore();
    const { isOpenModalGuess, modalActionGuess } = useUiGuess();

    const form = useForm({
        initialValues: {
            nombres_completos: "",
            telefono: "",
            codigo: "",
        },
        validate: {
            nombres_completos: isNotEmpty(
                "Por favor digite los nombres del invitado"
            ),
            telefono: isNotEmpty("Por favor digite el teléfono"),
            codigo: isNotEmpty("Por favor digite el código"),
        },
    });

    const handleCloseModal = () => {
        setActivateGuess(null);
        form.reset();
        modalActionGuess(false);
    };

    return (
        <Modal
            opened={isOpenModalGuess}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Invitado
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius="lg"
            size="lg"
        >
            <GuessForm form={form} />
        </Modal>
    );
};
