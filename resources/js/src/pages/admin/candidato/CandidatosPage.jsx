import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    CandidatoModal,
    CandidatoTable,
    ModalActivateElement,
    TitlePage,
} from "../../../components";
import { IconPencilPlus } from "@tabler/icons-react";
import { useCandidatoStore, useUiCandidato } from "../../../hooks";
import Swal from "sweetalert2";

const CandidatosPage = () => {
    const {
        startLoadCandidatos,
        startClearCandidatos,
        startUpdateActivo,
        activateCandidato,
        setActivateCandidato,
        message,
        errores,
    } = useCandidatoStore();

    const {
        isOpenModalStatusCandidato,
        modalActionCandidato,
        modalActionStatusCandidato,
    } = useUiCandidato();

    useEffect(() => {
        startLoadCandidatos();

        return () => {
            startClearCandidatos();
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
        modalActionCandidato(true);
    };

    return (
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={1}>Candidatos</TitlePage>
                <BtnSection
                    heigh={45}
                    handleAction={handleOpenModal}
                    IconSection={IconPencilPlus}
                >
                    Agregar Candidatos
                </BtnSection>
            </Group>
            <Divider my="md" />
            <CandidatoTable />

            <CandidatoModal />

            <ModalActivateElement
                isOpenModal={isOpenModalStatusCandidato}
                modalAction={modalActionStatusCandidato}
                startAction={startUpdateActivo}
                activateElement={activateCandidato}
                setActivateElement={setActivateCandidato}
            />
        </Container>
    );
};

export default CandidatosPage;
