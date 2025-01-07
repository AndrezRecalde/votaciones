import { useEffect, useMemo } from "react";
import {
    ActionIcon,
    Container,
    Divider,
    Grid,
    Group,
    LoadingOverlay,
    rem,
} from "@mantine/core";
import {
    BadgeElement,
    ChartResultado,
    StatEscrutinio,
    StatVocacion,
    TitlePage,
    WebsterBusqueda,
    //WebsterEscanioTable,
    WebsterTable,
} from "../../components";
import { IconFileTypePdf } from "@tabler/icons-react";
import { useFechaStore, useResultadoStore } from "../../hooks";
import Swal from "sweetalert2";

const DIGNIDAD_CURRENT = 3;

//TODO: COLOCAR UN LOADER CADA VEZ QUE SE CAMBIE LA CONSULTA DE DIGNIDAD_ID

const ResultadosWebsterPage = () => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);
    const { fechaActual } = useFechaStore();
    const {
        isLoading,
        pageLoad,
        message,
        errores,
        totalDeVotos,
        startLoadTotalDeVotos,
        startLoadTotalActasIngresadas,
        startLoadTotalJuntas,
        startLoadResultadosCandidatos,
        startClearResultados,
    } = useResultadoStore();

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

    return (
        <Container size="xl">
            <Group justify="space-between" mb={10}>
                <TitlePage order={2}>Resultados Webster</TitlePage>
                {/* {pageLoad && (totalDeVotos !== null || totalDeVotos > 0) ? (
                    <ActionIcon
                        size={42}
                        variant="default"
                        aria-label="download-xls"
                    >
                        <IconFileTypePdf
                            style={{ width: rem(24), height: rem(24) }}
                        />
                    </ActionIcon>
                ) : null} */}
            </Group>
            <Divider my="md" />
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Grid>
                <Grid.Col span={{ base: 14, xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <WebsterBusqueda dig={DIGNIDAD_CURRENT} />
                </Grid.Col>
                {pageLoad && (totalDeVotos !== null || totalDeVotos > 0) ? (
                    <>
                        <Grid.Col
                            span={{ base: 14, xs: 12, sm: 12, md: 4, lg: 4 }}
                        >
                            <StatVocacion />
                        </Grid.Col>
                        <Grid.Col
                            span={{ base: 14, xs: 12, sm: 12, md: 4, lg: 4 }}
                        >
                            <StatEscrutinio />
                        </Grid.Col>
                        <Grid.Col
                            span={{ base: 14, xs: 12, sm: 12, md: 12, lg: 12 }}
                        >
                            <Group justify="center">
                                <BadgeElement variant="filled">
                                    {`Fecha & Hora del reporte: ${fechaActual()}`}
                                </BadgeElement>
                            </Group>
                            <WebsterTable />
                        </Grid.Col>
                        {/* <Grid.Col
                            span={{ base: 14, xs: 12, sm: 12, md: 12, lg: 12 }}
                        >
                            <WebsterEscanioTable />
                        </Grid.Col> */}
                        <Grid.Col
                            span={{ base: 14, xs: 12, sm: 12, md: 12, lg: 12 }}
                        >
                            <ChartResultado />
                        </Grid.Col>
                    </>
                ) : null}
            </Grid>
        </Container>
    );
};

export default ResultadosWebsterPage;
