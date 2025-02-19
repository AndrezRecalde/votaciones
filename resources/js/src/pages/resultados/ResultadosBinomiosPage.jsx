import { useEffect, useMemo } from "react";
import {
    useFechaStore,
    useResultadoStore,
    useStorageStore,
    useTitleHook,
    useUiResultado,
} from "../../hooks";
import {
    ActionIcon,
    Card,
    Container,
    Divider,
    Group,
    LoadingOverlay,
    rem,
    SimpleGrid,
    Stack,
} from "@mantine/core";
import {
    BadgeElement,
    ChartResultado,
    ResultadoBusquedaForm,
    ResultadosExportModal,
    ResultadosExportModalXLS,
    StatEscrutinio,
    StatVocacion,
    TableResultado,
    TitlePage,
} from "../../components";
import Swal from "sweetalert2";
import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react";
//import useSWR from "swr";

const DIGNIDAD_CURRENT = 1;

const ResultadosPresidencialesPage = () => {
    useTitleHook("Elecciones | Binomios");
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);
    const { modalActionResultadosExport, modalActionResultadosExportXLS } = useUiResultado();
    const { fechaActual } = useFechaStore();
    const {
        isExport,
        isLoading,
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

    useEffect(() => {
        if (isExport === true) {
            Swal.fire({
                icon: "warning",
                text: "Un momento porfavor, se está exportando",
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close(); // Cierra el modal cuando isExport es false
        }
    }, [isExport]);

    const handleOpenExportPDF = (e) => {
        e.preventDefault();
        modalActionResultadosExport(true);
    };

    const handleOpenExportXLS = (e) => {
        e.preventDefault();
        modalActionResultadosExportXLS(true);
    };

    return (
        <Container size={1400}>
            <Group justify="space-between">
                <TitlePage order={2}>Resultados de Binomios</TitlePage>
                <Group>
                    <ActionIcon
                        size={42}
                        variant="default"
                        aria-label="download-xls"
                        onClick={(e) => handleOpenExportPDF(e)}
                    >
                        <IconFileTypePdf
                            style={{ width: rem(24), height: rem(24) }}
                        />
                    </ActionIcon>
                    <ActionIcon
                        size={42}
                        variant="default"
                        aria-label="download-xls"
                        onClick={(e) => handleOpenExportXLS(e)}
                    >
                        <IconFileTypeXls
                            style={{ width: rem(24), height: rem(24) }}
                        />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider my="md" />
            <Card withBorder shadow="sm" radius="md" mt={20}>
                <ResultadoBusquedaForm dig={DIGNIDAD_CURRENT} />
            </Card>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
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
                        <Group justify="center">
                            <BadgeElement variant="filled">
                                {`Fecha & Hora del reporte: ${fechaActual()}`}
                            </BadgeElement>
                        </Group>
                        <ChartResultado />
                    </SimpleGrid>
                    <SimpleGrid cols={1} mb={30}>
                        {" "}
                        <TableResultado />
                    </SimpleGrid>
                </Stack>
            ) : null}
            <ResultadosExportModal />
            <ResultadosExportModalXLS />
        </Container>
    );
};

export default ResultadosPresidencialesPage;
