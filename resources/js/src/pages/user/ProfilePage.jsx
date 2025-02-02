import { useEffect, useMemo } from "react";
import { Badge, Box, Card, Container, Group, LoadingOverlay } from "@mantine/core";
import {
    BadgeElement,
    ProfileBtnService,
    ProfileHeader,
    ProfileInformation,
    ProfileProgressActas,
    TextSection,
    TitlePage,
} from "../../components";
import { useEscrutinioStore, useTitleHook } from "../../hooks";

const ProfilePage = () => {
        useTitleHook("Elecciones | Perfil");
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);
    const {
        isLoading,
        resultadosEscrutinio,
        startLoadEscrutinioActas,
        startClearEscrutinios,
    } = useEscrutinioStore();

    useEffect(() => {
        startLoadEscrutinioActas();

        return () => {
            startClearEscrutinios();
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
                        <BadgeElement variant="filled" radiud="lg">
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
                </Card.Section>
            </Card>
        </Container>
    );
};

export default ProfilePage;
