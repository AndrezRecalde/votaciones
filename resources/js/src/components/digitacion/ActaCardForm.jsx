import { Card, NumberInput, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { TitlePage } from "../../components";
import classes from "../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";

export const ActaCardForm = ({ actaForm }) => {
    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <TitlePage order={4} ta="left">
                    Rellena los campos del acta
                </TitlePage>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="xs">
                <Stack>
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }}>
                        <TextInput
                            label="Código CNE"
                            placeholder="Digita el código CNE"
                            classNames={classes}
                            {...actaForm.getInputProps("cod_cne")}
                        />
                        <NumberInput
                            label="Total Firmas y Huellas"
                            placeholder="Registra el total de Firmas y Huellas"
                            hideControls
                            min={0}
                            classNames={classes}
                            {...actaForm.getInputProps("votos_validos")}
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }}>
                        <NumberInput
                            label="Votos en Blanco"
                            placeholder="Registra los votos en blanco"
                            classNames={classes}
                            hideControls
                            min={0}
                            {...actaForm.getInputProps("votos_blancos")}
                        />
                        <NumberInput
                            label="Votos Nulos"
                            placeholder="Registra los votos nulos"
                            classNames={classes}
                            hideControls
                            min={0}
                            {...actaForm.getInputProps("votos_nulos")}
                        />
                    </SimpleGrid>
                </Stack>
            </Card.Section>
        </Card>
    );
};
