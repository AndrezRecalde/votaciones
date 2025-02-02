import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import { BtnSection, OrganizacionModal, OrganizacionTable, TitlePage } from "../../../components";
import { useOrganizacionStore, useTitleHook, useUiOrganizacion } from "../../../hooks";
import { IconPencilPlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const OrganizacionesPage = () => {
    useTitleHook("Elecciones | Organizaciones");
    const {
        startLoadOrganizaciones,
        startClearOrganizaciones,
        setActivateOrganizacion,
        message,
        errores,
    } = useOrganizacionStore();

    const { modalActionOrganizacion } = useUiOrganizacion();

    useEffect(() => {
        startLoadOrganizaciones();

      return () => {
        startClearOrganizaciones();
      }
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
        setActivateOrganizacion(null);
        modalActionOrganizacion(true);
    };

    return (
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={1}>Organizaciones</TitlePage>
                <BtnSection
                    heigh={45}
                    handleAction={handleOpenModal}
                    IconSection={IconPencilPlus}
                >
                    Agregar Organización
                </BtnSection>
            </Group>
            <Divider my="md" />
            <OrganizacionTable />

            <OrganizacionModal />
        </Container>
    );
};

export default OrganizacionesPage;
