import { Container, Divider } from "@mantine/core";
import { DigitacionFilter, TitlePage } from "../../../components";
import { useJurisdiccionStore, useTitleHook } from "../../../hooks";
import { useEffect, useMemo } from "react";

const DigitacionConsultaPage = () => {
    useTitleHook("Elecciones - Digitación Consulta Popular");
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const { startLoadProvincias } = useJurisdiccionStore();

    useEffect(() => {
        startLoadProvincias({
            provincia_id: usuario.provincia_id,
            activo: true,
        });
    }, []);

    return (
        <Container size="xxl">
            <TitlePage order={2}>Acta de Escrutinio - Consulta Popular</TitlePage>
            <Divider mb={20} />
            <DigitacionFilter usuario={usuario} />
        </Container>
    );
};

export default DigitacionConsultaPage;
