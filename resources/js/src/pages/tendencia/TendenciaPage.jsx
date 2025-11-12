import { useEffect } from "react";
import { Box, Container, Divider } from "@mantine/core";
import {
    TendenciaBusquedaForm,
    TendenciaChart,
    TitlePage,
} from "../../components";
import {
    useDignidadStore,
    useJurisdiccionStore,
    useTendenciaStore,
    useTitleHook,
} from "../../hooks";

const TendenciaPage = () => {
    useTitleHook("Elecciones - Tendencias");
    const usuario = JSON.parse(localStorage.getItem("service_user")) || {};
    const { startLoadDignidades, startClearDignidades } = useDignidadStore();
    const { startLoadCantones } = useJurisdiccionStore();
    const { pageLoad, startClearTendencias } = useTendenciaStore();

    useEffect(() => {
        startLoadDignidades({ activo: true });
        startLoadCantones({ provincia_id: usuario?.provincia_id });

        return () => {
            startClearDignidades();
            startClearTendencias();
        };
    }, []);

    return (
        <Container size="xxl">
            <TitlePage order={2}>Seguimiento de Juntas</TitlePage>
            <Divider my="md" />
            <TendenciaBusquedaForm />
            {pageLoad ? (
                <Box mt={50}>
                    <TitlePage order={3} mb={20}>
                        Gráfico de Seguimiento por Juntas
                    </TitlePage>
                    <TendenciaChart />
                </Box>
            ) : null}
        </Container>
    );
};
export default TendenciaPage;
