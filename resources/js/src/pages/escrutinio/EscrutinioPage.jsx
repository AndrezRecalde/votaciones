import { useEffect } from "react";
import { Container, Divider, Group, LoadingOverlay } from "@mantine/core";
import { useEscrutinioStore, useFechaStore } from "../../hooks";
import { BadgeElement, EscrutinioChart, EscrutinioTable, TitlePage } from "../../components";
import Swal from "sweetalert2";

const EscrutinioPage = () => {
    const { fechaActual } = useFechaStore();
    const { isLoading, startLoadEscrutinios, startClearEscrutinios, errores } =
        useEscrutinioStore();

    useEffect(() => {
        startLoadEscrutinios();

        return () => {
            startClearEscrutinios();
        };
    }, []);

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

    return (
        <Container size="xxl">
            <Group justify="space-between">
                <TitlePage order={2}>
                    Avance de Escrutinio por Dignidades
                </TitlePage>
                <BadgeElement variant="light">
                    {`Fecha & Hora del reporte: ${fechaActual()}`}
                </BadgeElement>
            </Group>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Divider my="md" />
            <EscrutinioChart />
            <Divider my="lg" />
            <EscrutinioTable />
        </Container>
    );
};

export default EscrutinioPage;
