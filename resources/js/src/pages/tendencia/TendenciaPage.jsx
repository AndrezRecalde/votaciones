import { useEffect, useMemo } from "react";
import { Box, Container, Divider, LoadingOverlay } from "@mantine/core";
import {
    TendenciaBusquedaForm,
    TendenciaChart,
    TitlePage,
} from "../../components";
import {
    useDignidadStore,
    useJurisdiccionStore,
    useTendenciaStore,
} from "../../hooks";

const TendenciaPage = () => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);
    const { startLoadDignidades, startClearDignidades } = useDignidadStore();
    const { startLoadCantones } = useJurisdiccionStore();
    const { isLoading, pageLoad, startClearTendencias } = useTendenciaStore();

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
            <TitlePage order={2}>Tendencias</TitlePage>
            <Divider my="md" />
            <TendenciaBusquedaForm />
            <LoadingOverlay
                visible={isLoading}
                zIndex={500}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            {pageLoad ? (
                <Box mt={50}>
                    <TitlePage order={4}>
                        Gráfico de Tendencia por Dignidades
                    </TitlePage>
                    <TendenciaChart />
                </Box>
            ) : null}
        </Container>
    );
};
export default TendenciaPage;
