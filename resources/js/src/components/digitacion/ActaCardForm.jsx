import {
    Card,
    Group,
    NumberInput,
    SimpleGrid,
    Stack,
    TextInput,
    ThemeIcon,
} from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import classes from "../../assets/styles/modules/digitacion/LabelsDigitacion.module.css";
import { TextSection } from "../elements/titles/TextSection";

export const ActaCardForm = ({ actaForm }) => {
    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Group gap="xs">
                    <ThemeIcon size="lg" radius="md" variant="default">
                        <IconListCheck size={20} />
                    </ThemeIcon>
                    <div>
                        <TextSection tt="" fw={700} fz={18}>
                            Rellena los campos del acta
                        </TextSection>
                    </div>
                </Group>
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
