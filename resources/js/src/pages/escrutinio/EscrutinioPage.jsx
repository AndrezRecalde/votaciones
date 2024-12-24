import { useEffect } from "react";
import { Badge, Container, Divider, Group } from "@mantine/core";
import { useEscrutinioStore, useFechaStore } from "../../hooks";
import { EscrutinioChart, EscrutinioTable, TitlePage } from "../../components";
import Swal from "sweetalert2";

const EscrutinioPage = () => {
    const { fechaActual } = useFechaStore();
    const { startLoadEscrutinios, startClearEscrutinios, errores } = useEscrutinioStore();

    useEffect(() => {
        startLoadEscrutinios();

        return () => {
            startClearEscrutinios();
          }
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
                <Badge variant="light" size="lg" radius="md" color="indigo.7">
                    {`Fecha & Hora del reporte: ${fechaActual()}`}
                </Badge>
            </Group>
            <Divider my="md" />
            <EscrutinioChart />
            <Divider my="lg" />
            <EscrutinioTable />
        </Container>
    );
};

export default EscrutinioPage;
