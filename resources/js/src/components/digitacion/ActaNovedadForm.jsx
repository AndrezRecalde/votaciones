import { useEffect, useState } from "react";
import { useActaStore } from "../../hooks";
import {
    ActionIcon,
    Card,
    Checkbox,
    Flex,
    Group,
    Paper,
    SimpleGrid,
} from "@mantine/core";
import { BtnSubmit, TextSection } from "../../components";
import { IconCheckbox, IconRotate2 } from "@tabler/icons-react";
import classes from "../../assets/styles/modules/digitacion/ActaDigitacion.module.css";

export const ActaNovedadForm = ({ actaForm }) => {
    const [totales, setTotales] = useState(0);

    const { startClearActa, startActivateSearch, activateActa } =
        useActaStore();

    const {
        num_votos,
        votos_blancos,
        votos_nulos,
        votos_validos,
        legible,
        cuadrada,
    } = actaForm.values;

    useEffect(() => {
        setTotales(
            num_votos
                .filter((num) => num !== undefined)
                .reduce((a, b) => parseInt(a) + parseInt(b), 0)
        );
    }, [num_votos]);

    useEffect(() => {
        if (totales + votos_blancos + votos_nulos !== votos_validos) {
            actaForm.setFieldValue("cuadrada", false);
        } else {
            actaForm.setFieldValue("cuadrada", true);
        }
    }, [totales, votos_validos, votos_blancos, votos_nulos]);

    const handleResetSearch = () => {
        startClearActa();
        startActivateSearch(false);
    };

    return (
        <Card withBorder radius="md" p="xl">
            <Card.Section withBorder inheritPadding py="lg">
                <Checkbox
                    className={classes.checkbox}
                    label={
                        <TextSection tt="" fw={500} fz={15} ta="left">
                            Si el acta no es legible, quite el check.
                        </TextSection>
                    }
                    wrapperProps={{
                        onClick: () =>
                            actaForm.setFieldValue("legible", !legible),
                    }}
                    {...actaForm.getInputProps("legible", {
                        type: "checkbox",
                    })}
                />
                <Checkbox
                    disabled
                    className={classes.checkbox}
                    label={
                        <TextSection tt="" fw={500} fz={15} ta="left">
                            Si los valores del acta no coinciden, quite el
                            check.
                        </TextSection>
                    }
                    /* wrapperProps={{
                        onClick: () =>
                            actaForm.setFieldValue("cuadrada", !cuadrada),
                    }} */
                    {...actaForm.getInputProps("cuadrada", {
                        type: "checkbox",
                    })}
                />
            </Card.Section>
            <Card.Section withBorder inheritPadding py="lg">
                <Flex gap="xs" align="center" direction="row" mt={5}>
                    <ActionIcon
                        color="dark"
                        radius="xl"
                        size="xl"
                        onClick={handleResetSearch}
                    >
                        <IconRotate2 />
                    </ActionIcon>
                    <BtnSubmit heigh={50}>Ingresar Acta</BtnSubmit>
                </Flex>
            </Card.Section>

            {activateActa?.actualizador ? (
                <Card.Section withBorder inheritPadding py="lg">
                    <Paper shadow="xs" p="xl">
                        <Group justify="space-between">
                            <div>
                                <TextSection fw={700} fz={14} ta="left">
                                    Acta Actualizada por:
                                </TextSection>
                                <TextSection tt="" fw={500} fz={15} ta="left">
                                    {activateActa?.actualizador}
                                </TextSection>
                            </div>
                            <div>
                                <IconCheckbox stroke={1.5} size={35} />
                            </div>
                        </Group>
                    </Paper>
                </Card.Section>
            ) : activateActa?.creador ? (
                <Card.Section withBorder inheritPadding py="lg">
                    <Paper shadow="xs" p="xl">
                        <Group justify="space-between">
                            <div>
                                <TextSection fw={700} fz={14} ta="left">
                                    Acta Ingresada por:
                                </TextSection>
                                <TextSection tt="" fw={500} fz={15} ta="left">
                                    {activateActa?.creador}
                                </TextSection>
                            </div>
                            <div>
                                <IconCheckbox stroke={1.5} size={35} />
                            </div>
                        </Group>
                    </Paper>
                </Card.Section>
            ) : null}
            <Card.Section withBorder inheritPadding py="lg">
                <SimpleGrid cols={2}>
                    <Paper
                        shadow="xs"
                        p="xl"
                        className={
                            totales + votos_blancos + votos_nulos ===
                            votos_validos
                                ? classes.cardUserInfo
                                : null
                        }
                    >
                        <TextSection fw={700} fz={14} ta="left">
                            Total Huellas
                        </TextSection>
                        <TextSection tt="" fw={500} fz={15} ta="left">
                            {votos_validos.toString()}
                        </TextSection>
                    </Paper>
                    <Paper
                        shadow="xs"
                        p="xl"
                        className={
                            totales + votos_blancos + votos_nulos ===
                            votos_validos
                                ? classes.cardUserInfo
                                : null
                        }
                    >
                        <TextSection fw={700} fz={14} ta="left">
                            Total Votos
                        </TextSection>
                        <TextSection tt="" fw={500} fz={15} ta="left">
                            {(
                                votos_blancos +
                                votos_nulos +
                                parseInt(totales * 1)
                            ).toString()}
                        </TextSection>
                    </Paper>
                </SimpleGrid>
            </Card.Section>
        </Card>
    );
};
