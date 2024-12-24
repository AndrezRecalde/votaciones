import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { TextSection, UsuarioForm } from "../../../components";
import {
    useJurisdiccionStore,
    useRoleStore,
    useUiUsuario,
    useUsuarioStore,
} from "../../../hooks";
import { isNotEmpty, useForm } from "@mantine/form";

export const UsuarioModal = () => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { isOpenModalUsuario, modalActionUsuario } = useUiUsuario();
    const { setActivateUsuario } = useUsuarioStore();
    const { startLoadRoles, startClearRoles } = useRoleStore();
    const { startLoadProvincias, startClearJurisdicciones } =
        useJurisdiccionStore();

    const form = useForm({
        initialValues: {
            nombres_completos: "",
            dni: "",
            role: 3,
            provincia_id: null,
            es_cantonal: false,
            es_responsable: false,
            canton_id: null,
        },
        validate: {
            nombres_completos: isNotEmpty(
                "Por favor ingrese los nombres completos"
            ),
            dni: isNotEmpty("Por favor ingrese el número de cédula"),
            role: isNotEmpty("Especifíque el role del usuario"),
            provincia_id: isNotEmpty("Por favor ingrese la provincia"),
        },
        transformValues: (values) => ({
            ...values,
            role: Number(values.role) || null,
            provincia_id: Number(values.provincia_id) || null,
        }),
    });

    useEffect(() => {
        if (isOpenModalUsuario) {
            startLoadRoles();
            startLoadProvincias({ provincia_id: usuario.provincia_id });
        }

        return () => {
            startClearRoles();
            startClearJurisdicciones();
        };
    }, [isOpenModalUsuario]);

    const handleCloseModal = () => {
        setActivateUsuario(null);
        form.reset();
        modalActionUsuario(false);
    };

    return (
        <Modal
            opened={isOpenModalUsuario}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Usuario
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius="lg"
            size="lg"
        >
            <UsuarioForm form={form} />
        </Modal>
    );
};
