import { useEffect, useState } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    ModalActivateElement,
    PreguntaModal,
    PreguntasTable,
    TitlePage,
} from "../../../components";
import { usePreguntaStore, useTitleHook, useUiPregunta } from "../../../hooks";
import { IconPencilPlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const PreguntasConsultaPage = () => {
    useTitleHook("Elecciones - Preguntas");
    const {
        startLoadPreguntas,
        startUpdateActivo,
        startClearPreguntas,
        activatePregunta,
        setActivatePregunta,
        message,
        errores,
    } = usePreguntaStore();
    const {
        isOpenModalStatusPregunta,
        modalActionPregunta,
        modalActionStatusPregunta,
    } = useUiPregunta();

    // Estado local para controlar la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    // Cargar preguntas cuando cambia la paginación local
    useEffect(() => {
        startLoadPreguntas({
            page: pagination.pageIndex + 1, // Backend usa base 1
            per_page: pagination.pageSize,
        });
        return () => {
            startClearPreguntas();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize]);

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
        modalActionPregunta(true);
    };

    return (
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={1}>Preguntas</TitlePage>
                <BtnSection
                    height={45}
                    handleAction={handleOpenModal}
                    IconSection={IconPencilPlus}
                >
                    Agregar Preguntas
                </BtnSection>
            </Group>
            <Divider my="md" />
            <PreguntasTable
                pagination={pagination}
                setPagination={setPagination}
            />
            <PreguntaModal />

            <ModalActivateElement
                isOpenModal={isOpenModalStatusPregunta}
                modalAction={modalActionStatusPregunta}
                startAction={startUpdateActivo}
                activateElement={activatePregunta}
                setActivateElement={setActivatePregunta}
            />
        </Container>
    );
};

export default PreguntasConsultaPage;
