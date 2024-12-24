import { SimpleGrid } from "@mantine/core";
import { TextSection } from "../elements/titles/TextSection";

export const ProfileInformation = ({ usuario }) => {
    return (
        <SimpleGrid
            cols={{ base: 3, sm: 3, lg: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
        >
            <div>
                <TextSection tt="" fw={700} fz={16} ta="center">
                    {usuario?.dni || "Sin datos"}
                </TextSection>
                <TextSection
                    tt="uppercase"
                    fz={14}
                    fw={600}
                    color="dimmed"
                    ta="center"
                >
                    Cédula
                </TextSection>
            </div>
            <div>
                <TextSection tt="" fw={700} fz={16} ta="center">
                    {usuario?.nombre_provincia || "Sin datos"}
                </TextSection>
                <TextSection
                    tt="uppercase"
                    fz={14}
                    fw={600}
                    color="dimmed"
                    ta="center"
                >
                    Provincia
                </TextSection>
            </div>
            <div>
                <TextSection tt="" fw={700} fz={16} ta="center">
                    {usuario?.nombre_canton || "Eres digitador provincial"}
                </TextSection>
                <TextSection
                    tt="uppercase"
                    fz={14}
                    fw={600}
                    color="dimmed"
                    ta="center"
                >
                    Cantón
                </TextSection>
            </div>
        </SimpleGrid>
    );
};
