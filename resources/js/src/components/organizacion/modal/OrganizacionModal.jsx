import { Modal } from "@mantine/core";
import { OrganizacionForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useOrganizacionStore, useUiOrganizacion } from "../../../hooks";

export const OrganizacionModal = () => {
    const { setActivateOrganizacion } = useOrganizacionStore();
    const { isOpenModalOrganizacion, modalActionOrganizacion } = useUiOrganizacion();

    const form = useForm({
        initialValues: {
            nombre_organizacion: "",
            numero_organizacion: 0,
            sigla: "",
            color: "",
            logo_url: null
        },
        validate: {
            nombre_organizacion: isNotEmpty("Digite el nombre de la organización"),
            numero_organizacion: isNotEmpty("Digite el número de la organización"),
            sigla: isNotEmpty("Digite las siglas"),
            color: isNotEmpty("Digite el color"),
            logo_url: isNotEmpty("Ingrese el logo de la organización"),
        },
    });

    const handleCloseModal = () => {
        setActivateOrganizacion(null);
        form.reset();
        modalActionOrganizacion(false);
    };

    return (
        <Modal
            opened={isOpenModalOrganizacion}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Organización
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius="lg"
            size="lg"
        >
            <OrganizacionForm form={form} />
        </Modal>
    );
};
