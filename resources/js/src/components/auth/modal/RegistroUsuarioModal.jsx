import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { TextSection, UsuarioForm } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useJurisdiccionStore, useRoleStore, useUiAuth } from "../../../hooks";

export const RegistroUsuarioModal = () => {
    const { isOpenModalRegisterUser, modalActionRegisterUser } = useUiAuth();
    const { startLoadRoles, startClearRoles } = useRoleStore();
    const { startLoadProvincias, startClearJurisdicciones } =
        useJurisdiccionStore();

    const form = useForm({
        initialValues: {
            nombres_completos: "",
            dni: "",
            role: '2',
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
            if (isOpenModalRegisterUser) {
                startLoadRoles();
                startLoadProvincias({ provincia_id: 8 });
            }

            return () => {
                startClearRoles();
                startClearJurisdicciones();
            };
        }, [isOpenModalRegisterUser]);

        const handleCloseModal = () => {
            //setActivateUsuario(null);
            form.reset();
            modalActionRegisterUser(false);
        };

    return (
        <Modal
            opened={isOpenModalRegisterUser}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Registro de usuario
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
