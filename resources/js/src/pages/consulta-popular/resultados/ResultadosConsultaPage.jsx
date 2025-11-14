import { useEffect } from "react";
import { Container, Divider, Grid, Group } from "@mantine/core";
import {
    FechaActual,
    ResultadosConsultaChart,
    ResultadosConsultaFilter,
    ResultadosConsultaTable,
    TitlePage,
} from "../../../components";
import { useResultadoConsultaStore, useTitleHook } from "../../../hooks";
import Swal from "sweetalert2";

const ResultadosConsultaPage = () => {
    useTitleHook("Elecciones - Resultados Consulta Popular");
    const usuario = JSON.parse(localStorage.getItem("service_user")) || {};
    const { startClearResultadosConsulta, errores } =
        useResultadoConsultaStore();

    useEffect(() => {
        return () => {
            startClearResultadosConsulta();
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
        <Container size={1600}>
            <Group justify="space-between">
                <TitlePage order={2}>
                    Resultados de Consulta Popular - 2025
                </TitlePage>
            </Group>
            <Divider mb={20} />
            <Grid>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 3, lg: 3 }}>
                    <ResultadosConsultaFilter usuario={usuario} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 9, lg: 9 }}>
                    <FechaActual />
                    <ResultadosConsultaChart />
                    <ResultadosConsultaTable />
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default ResultadosConsultaPage;
