import { useEffect } from "react";
import { Container, Divider, Group, LoadingOverlay } from "@mantine/core";
import {
    BadgeElement,
    EscrutinioConsultaBarChart,
    EscrutinioConsultaTable,
    TitlePage,
} from "../../../components";
import {
    useEscrutinioConsultaStore,
    useFechaStore,
    useTitleHook,
} from "../../../hooks";

const EscrutinioConsultaPage = () => {
    useTitleHook("Elecciones - Escrutinio Consulta Popular");
    const { fechaActual } = useFechaStore();
    const {
        isLoading,
        startLoadEscrutinioConsulta,
        startClearEscrutinioConsulta,
    } = useEscrutinioConsultaStore();

    useEffect(() => {
        startLoadEscrutinioConsulta({
            nivel: "canton",
            provincia_id: 8,
        });

        return () => {
            startClearEscrutinioConsulta();
        };
    }, []);

    return (
        <Container size="xxl">
            <Group justify="space-between">
                <TitlePage order={2}>
                    Avance de Escrutinio - Consulta Popular
                </TitlePage>
                <BadgeElement variant="default">
                    {`Fecha & Hora del reporte: ${fechaActual()}`}
                </BadgeElement>
            </Group>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Divider my="md" />
            <EscrutinioConsultaBarChart />
            <EscrutinioConsultaTable />
        </Container>
    );
};

export default EscrutinioConsultaPage;
