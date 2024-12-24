import { useEffect, useMemo } from "react";
import { useResultadoStore, useStorageStore } from "../../hooks";
import {
    ActionIcon,
    Card,
    Container,
    Divider,
    Group,
    rem,
    SimpleGrid,
    Stack,
} from "@mantine/core";
import {
    ChartResultado,
    ResultadoBusquedaForm,
    StatEscrutinio,
    StatVocacion,
    TableResultado,
    TitlePage,
} from "../../components";
import Swal from "sweetalert2";
import { IconFileTypeXls } from "@tabler/icons-react";
import useSWR from "swr";

const DIGNIDAD_CURRENT = 1;

const ResultadosPresidencialesPage = () => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const {
        errores,
        pageLoad,
        totalDeVotos,
        startLoadTotalDeVotos,
        startLoadTotalActasIngresadas,
        startLoadTotalJuntas,
        startLoadResultadosCandidatos,
        startClearResultados,
    } = useResultadoStore();

    const { selectedFields } = useStorageStore();

    const { provincia_id } = usuario;
    const valores = { dignidad_id: DIGNIDAD_CURRENT, provincia_id };

    useEffect(() => {
        startLoadTotalDeVotos(valores);
        startLoadTotalActasIngresadas(valores);
        startLoadTotalJuntas(valores);
        startLoadResultadosCandidatos(valores);

        return () => {
            startClearResultados();
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
        <Container size="xl">
            <Group justify="space-between">
                <TitlePage order={2}>Resultados de Binomios</TitlePage>
                <ActionIcon
                    size={42}
                    variant="default"
                    aria-label="download-xls"
                >
                    <IconFileTypeXls
                        style={{ width: rem(24), height: rem(24) }}
                    />
                </ActionIcon>
            </Group>
            <Divider my="md" />
            <Card withBorder shadow="sm" radius="md" mt={20}>
                <ResultadoBusquedaForm dig={DIGNIDAD_CURRENT} />
            </Card>

            {pageLoad && totalDeVotos !== null ? (
                <Stack>
                    <TitlePage ta="center" order={2} mt={20}>
                        Resultados
                    </TitlePage>

                    <SimpleGrid
                        cols={{ base: 2, xs: 1, sm: 1, md: 2, lg: 2 }}
                        mb={50}
                    >
                        <StatVocacion />
                        <StatEscrutinio />
                    </SimpleGrid>
                    <SimpleGrid cols={1} mb={30}>
                        <ChartResultado />
                    </SimpleGrid>
                    <SimpleGrid cols={1} mb={30}>
                        {" "}
                        <TableResultado />
                    </SimpleGrid>
                </Stack>
            ) : null}
        </Container>
    );
};

export default ResultadosPresidencialesPage;
