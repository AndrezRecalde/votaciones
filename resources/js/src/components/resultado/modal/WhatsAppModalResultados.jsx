import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { TextSection, WhatsAppForm } from "../../../components";
import { useDignidadStore, useUiResultado } from "../../../hooks";
import { useForm } from "@mantine/form";

export const WhatsAppModalResultados = () => {
    const { startLoadDignidades, dignidades } = useDignidadStore();
    const { isOpenModalWhatsApp, modalActionWhatsApp } = useUiResultado();

    const form = useForm({
        initialValues: {
            phone: "+593968604145",
            dignidad_id: null,
            provincia_id: 8,
            isMessage: false,
            message: "",
        },
        validate: (values) => {
            if (values.isMessage && values.message.trim() === "") {
                return { message: "El mensaje es requerido" };
            }
            if (!values.isMessage && values.dignidad_id === null) {
                return { dignidad_id: "La dignidad es requerida" };
            }
            return null;
        },
        transformValues: (values) => ({
            dignidad_id: Number(values.dignidad_id) || null,
        }),
    });

    useEffect(() => {
        if (isOpenModalWhatsApp && dignidades.length === 0) {
            startLoadDignidades({ activo: true });
            return;
        }
    }, [isOpenModalWhatsApp]);

    const handleCloseModal = () => {
        form.reset();
        modalActionWhatsApp();
    };

    return (
        <Modal
            centered
            opened={isOpenModalWhatsApp}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fw={700} fz={16}>
                    ¡Enviar Whatsapp!
                </TextSection>
            }
            size="md"
            radius="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <WhatsAppForm form={form} />
        </Modal>
    );
};
