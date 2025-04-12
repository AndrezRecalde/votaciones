import { Card } from "@mantine/core";
import { EscrutinioParcial, TextSection, TitlePage } from "../../components";
import { useResultadoStore } from "../../hooks";

export const StatEscrutinio = () => {
    const { totalActasIngresadas, totalJuntas } = useResultadoStore();

    // Validación y cálculo centralizado
    const total = totalJuntas?.total || 0;
    const digitadas = totalActasIngresadas?.digitadas || 0;
    const restantes = total - digitadas;

    // Determinar el mensaje a mostrar
    const statusMessage =
        restantes === 0
            ? "Actas 100% Ingresadas"
            : `Faltan: ${restantes} actas`;

    return (
        <Card withBorder shadow="sm" radius="md" mt={10}>
            <Card.Section withBorder inheritPadding py="xs">
                <TitlePage order={6}>TOTAL ESCRUTADO EN ACTAS - {((digitadas / total) * 100).toFixed(2)}%</TitlePage>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
                <EscrutinioParcial />
            </Card.Section>
            <Card.Section withBorder inheritPadding py="lg">
                <TextSection tt="" fw={700} fz={20} ta="center">
                    {statusMessage}
                </TextSection>
            </Card.Section>
        </Card>
    );
};
