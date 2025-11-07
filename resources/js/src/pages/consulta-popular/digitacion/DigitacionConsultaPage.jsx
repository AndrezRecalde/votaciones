import { Container, Divider, Grid } from "@mantine/core";
import {
    ActaConsultaSection,
    DigitacionFilter,
    TitlePage,
} from "../../../components";
import {
    useActaConsultaStore,
    useJurisdiccionStore,
    usePreguntaStore,
    useTitleHook,
} from "../../../hooks";
import { useEffect, useMemo } from "react";
import Swal from "sweetalert2";

const DigitacionConsultaPage = () => {
    useTitleHook("Elecciones - Digitación Consulta Popular");
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const { startLoadProvincias } = useJurisdiccionStore();
    const { startLoadPreguntas, startClearPreguntas } = usePreguntaStore();
    const { loadingActaConsulta, message, errores } = useActaConsultaStore();

    useEffect(() => {
        startLoadProvincias({
            provincia_id: usuario.provincia_id,
            activo: true,
        });

        startLoadPreguntas({ all: true });

        return () => {
            startClearPreguntas();
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
        <Container size="xxl">
            <TitlePage order={2}>
                Acta de Escrutinio - Consulta Popular
            </TitlePage>
            <Divider mb={20} />
            <Grid>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 3, lg: 3 }}>
                    <DigitacionFilter usuario={usuario} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 9, lg: 9 }}>
                    {loadingActaConsulta ? <ActaConsultaSection /> : null}
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default DigitacionConsultaPage;
