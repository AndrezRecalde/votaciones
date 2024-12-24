import { Paper, Stack } from "@mantine/core";
import { TextSection } from "../../components";
import { useResultadoStore } from "../../hooks";

export const StatVocacion = () => {
    const { totalDeVotos } = useResultadoStore();

    return (
        <Stack mt={20}>
            <Paper withBorder shadow="md" p="xl">
                <TextSection fw={700} fz={14} ta="left">
                    Total Huellas/Firmas
                </TextSection>
                <TextSection tt="" fw={500} fz={15} ta="left">
                    {totalDeVotos?.total_votos_validos} votos
                </TextSection>
            </Paper>
            <Paper withBorder shadow="md" p="xl">
                <TextSection fw={700} fz={14} ta="left">
                    Total Votos En Blanco
                </TextSection>
                <TextSection tt="" fw={500} fz={15} ta="left">
                    {totalDeVotos?.total_votos_blancos} votos - {" "}
                    {(
                        (totalDeVotos?.total_votos_blancos * 100) /
                        totalDeVotos?.total_votos_validos
                    ).toFixed(2)}{" "}
                    %
                </TextSection>
            </Paper>
            <Paper withBorder shadow="md" p="xl">
                <TextSection fw={700} fz={14} ta="left">
                    Total Votos Nulos
                </TextSection>
                <TextSection tt="" fw={500} fz={15} ta="left">
                    {totalDeVotos?.total_votos_nulos} votos - {" "}
                    {(
                        (totalDeVotos?.total_votos_nulos * 100) /
                        totalDeVotos?.total_votos_validos
                    ).toFixed(2)}{" "}
                    %
                </TextSection>
            </Paper>
        </Stack>
    );
};
