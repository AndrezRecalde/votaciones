import { useEffect } from "react";
import {
    /* Box, */
    Card,
    Container,
    Group,
    LoadingOverlay,
} from "@mantine/core";
import {
    BadgeElement,
    ProfileBtnService,
    ProfileContarActasConsulta,
    //ProfileContarActas,
    ProfileHeader,
    ProfileInformation,
    ProfileProgressActasConsulta,
    //ProfileProgressActas,
    TextSection,
    TitlePage,
} from "../../components";
import {
    useEscrutinioConsultaStore,
    /* useEscrutinioStore, */ useTitleHook /* useUsuarioStore */,
} from "../../hooks";

const ProfilePage = () => {
    useTitleHook("Elecciones - Perfil");
    const usuario = JSON.parse(localStorage.getItem("service_user")) || {};
    //const { startContarActas } = useUsuarioStore();
    /* const {
        isLoading,
        resultadosEscrutinio,
        startLoadEscrutinioActas,
        //startClearEscrutinios,
    } = useEscrutinioStore(); */

    const { isLoading, startLoadResumenUsuario, startClearEscrutinioConsulta } =
        useEscrutinioConsultaStore();

    useEffect(() => {
        //startContarActas(usuario?.id);
        //startLoadEscrutinioActas();
        startLoadResumenUsuario(usuario?.id);

        return () => {
            //startClearEscrutinios();
            startClearEscrutinioConsulta();
        };
    }, []);

    return (
        <Container size="md">
            <TitlePage order={1}>Perfil</TitlePage>
            <Card
                withBorder
                shadow="sm"
                radius="md"
                p="lg"
                mt={20}
                mb={20}
                sx={{ position: "static", height: "50" }}
            >
                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between">
                        <TextSection fw={700} tt="" fz={18} color="dimmed">
                            Bienvenido
                        </TextSection>
                        <BadgeElement variant="filled" radius="lg">
                            {usuario?.role || "Sin datos"}
                        </BadgeElement>
                    </Group>
                </Card.Section>
                <Card.Section withBorder inheritPadding py="xs">
                    <ProfileHeader usuario={usuario} />
                </Card.Section>
                <Card.Section withBorder inheritPadding py="xs">
                    <ProfileInformation usuario={usuario} />
                </Card.Section>
                <Card.Section withBorder inheritPadding py="xs">
                    <ProfileBtnService />
                </Card.Section>
                <Card.Section withBorder inheritPadding py="xs">
                    {/* <ProfileContarActas /> */}
                    <ProfileContarActasConsulta />
                </Card.Section>
                {/*  <Card.Section withBorder inheritPadding py="xs">
                    <LoadingOverlay
                        visible={isLoading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />
                    {resultadosEscrutinio?.map((escrutinio, index) => (
                        <Box key={index} mt={20}>
                            <ProfileProgressActas escrutinio={escrutinio} />
                        </Box>
                    ))}
                </Card.Section> */}
                <Card.Section withBorder inheritPadding py="xs">
                    <LoadingOverlay
                        visible={isLoading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2 }}
                    />
                    <ProfileProgressActasConsulta />
                </Card.Section>
            </Card>
        </Container>
    );
};

export default ProfilePage;
