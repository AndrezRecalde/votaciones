import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    SeguimientoBusquedaForm,
    SeguimientoConsultaJuntasChart,
    TitlePage,
} from "../../../components";
import {
    useJurisdiccionStore,
    usePreguntaStore,
    useTendenciaConsultaStore,
    useTitleHook,
} from "../../../hooks";

const SeguimientoConsultaJuntasPage = () => {
    useTitleHook("Elecciones - Seguimiento de Juntas - Consulta Popular");
    const usuario = JSON.parse(localStorage.getItem("service_user")) || {};
    const { pageLoad, startClearTendenciasConsulta } = useTendenciaConsultaStore();
    const { startLoadCantones, startClearJurisdicciones } =
        useJurisdiccionStore();
    const { startLoadPreguntas, startClearPreguntas } = usePreguntaStore();

    useEffect(() => {
        if (usuario?.provincia_id) {
            startLoadCantones({ provincia_id: usuario.provincia_id });
        }
        startLoadPreguntas({ all: true });

        return () => {
            startClearJurisdicciones();
            startClearPreguntas();
            startClearTendenciasConsulta();
        };
    }, []);

    return (
        <Container size="xxl">
            <TitlePage order={2}>
                Seguimiento de Juntas - Consulta Popular
            </TitlePage>
            <Divider my="md" />
            <SeguimientoBusquedaForm />
            {pageLoad ? (
                <div style={{ marginTop: 50 }}>
                    <TitlePage order={3} mb={20}>
                        Gráfico de Seguimiento por Juntas
                    </TitlePage>
                    <SeguimientoConsultaJuntasChart />
                </div>
            ) : null}
        </Container>
    );
};

export default SeguimientoConsultaJuntasPage;
