import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    GuessModal,
    GuessTable,
    ModalActivateElement,
    TitlePage,
} from "../../../components";
import { IconPencilPlus } from "@tabler/icons-react";
import { useGuessStore, useUiGuess } from "../../../hooks";
import Swal from "sweetalert2";

const GuessesPage = () => {
    const {
        startLoadGuess,
        startUpdateActivo,
        startClearGuess,
        setActivateGuess,
        activateGuess,
        message,
        errores,
    } = useGuessStore();
    const { isOpenModalStatusGuess, modalActionGuess, modalActionStatusGuess } = useUiGuess();

    useEffect(() => {
        startLoadGuess();

        return () => {
            startClearGuess();
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
        setActivateGuess(null);
        modalActionGuess(true);
    };

    return (
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={1}>Invitados</TitlePage>
                <BtnSection
                    heigh={45}
                    handleAction={handleOpenModal}
                    IconSection={IconPencilPlus}
                >
                    Agregar Invitado
                </BtnSection>
            </Group>
            <Divider my="md" />
            <GuessTable />

            <GuessModal />

            <ModalActivateElement
                isOpenModal={isOpenModalStatusGuess}
                modalAction={modalActionStatusGuess}
                activateElement={activateGuess}
                startAction={startUpdateActivo}
                setActivateElement={setActivateGuess}
            />
        </Container>
    );
};

export default GuessesPage;
