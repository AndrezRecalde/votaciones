import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    TitlePage,
    UsuariosTable,
    UsuarioModal,
    ModalActivateElement,
} from "../../components";
import { IconPencilPlus } from "@tabler/icons-react";
import { useUiUsuario, useUsuarioStore } from "../../hooks";
import Swal from "sweetalert2";

const UsuariosPage = () => {
    const {
        startLoadUsuarios,
        startUpdateActivo,
        startClearUsuarios,
        activateUsuario,
        setActivateUsuario,
        message,
        errores,
    } = useUsuarioStore();
    const {
        isOpenModalStatusUsuario,
        modalActionUsuario,
        modalActionStatusUsuario,
    } = useUiUsuario();

    useEffect(() => {
        startLoadUsuarios();

        return () => {
            startClearUsuarios();
        };
    }, []);

    useEffect(() => {
        if (message !== undefined) {
            Swal.fire({
                icon: message.status,
                text: message.msg,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
    }, [message]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                title: "Opps...",
                text: errores,
                confirmButtonColor: "#094293",
            });
            return;
        }
    }, [errores]);

    const handleOpenModal = (e) => {
        e.preventDefault();
        setActivateUsuario(null);
        modalActionUsuario(true);
    };

    return (
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={1}>Administrar Usuarios</TitlePage>
                <BtnSection
                    heigh={45}
                    handleAction={handleOpenModal}
                    IconSection={IconPencilPlus}
                >
                    Agregar usuario
                </BtnSection>
            </Group>
            <Divider my="md" />
            <UsuariosTable />

            <UsuarioModal />
            <ModalActivateElement
                isOpenModal={isOpenModalStatusUsuario}
                modalAction={modalActionStatusUsuario}
                activateElement={activateUsuario}
                startAction={startUpdateActivo}
                setActivateElement={setActivateUsuario}
            />
        </Container>
    );
};

export default UsuariosPage;
