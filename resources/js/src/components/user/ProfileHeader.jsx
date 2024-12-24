import { useMemo } from "react";
import { Avatar, Group, Stack } from "@mantine/core";
import { TextSection } from "../elements/titles/TextSection";

export const ProfileHeader = ({ usuario }) => {

    const iniciales = useMemo(() => {
        if (!usuario || !usuario.nombres_completos) return "G"; // Valor predeterminado si `usuario` no tiene alias
        const [firstName = "", lastName = ""] =
            usuario.nombres_completos.split(" ");
        return `${firstName[0] || ""}${lastName[0] || ""}`;
    }, [usuario]);

    return (
        <Stack>
            <Group justify="center">
                <Avatar variant="light" color="indigo.7" radius="xl" size="xl">
                    {iniciales}
                </Avatar>
                <TextSection tt="" fz={20} fw={700}>
                    {usuario?.nombres_completos || "Sin datos"}
                </TextSection>
            </Group>
        </Stack>
    );
};
