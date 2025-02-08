import { useEffect } from "react";
import { Avatar, Card, Grid, NumberInput } from "@mantine/core";
import { TextSection, TitlePage } from "../../components";
import { useActaStore, useStorageStore } from "../../hooks";
import classes from "../../assets/styles/modules/digitacion/ActaDigitacion.module.css";

export const ActaCardDetalleForm = ({ actaForm }) => {
    const { existeActa, activateActa, startLoadCandidatos, activateCandidatos } =
        useActaStore();
    const { selectedFields } = useStorageStore();

    useEffect(() => {
        const timeout = setTimeout(() => {
            startLoadCandidatos(activateActa ?? selectedFields);
        }, 300); // Espera 300ms antes de ejecutar la carga

        return () => clearTimeout(timeout); // Limpia el timeout si el valor cambia antes de los 300ms
    }, [existeActa, selectedFields]);

    useEffect(() => {
        if (activateCandidatos !== null) {
            activateCandidatos?.map((candidato, index) =>
                actaForm.setFieldValue(
                    `num_votos.${index}`,
                    candidato?.num_votos ?? candidato?.num_votos
                )
            );
            return;
        }
    }, [activateCandidatos]);

    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <TitlePage order={4} ta="left">
                    Asignar Votos
                </TitlePage>
            </Card.Section>
            <Card.Section withBorder inheritPadding py="lg">
                {activateCandidatos?.map((candidato, index) => (
                    <div key={candidato.id} className={classes.item}>
                        <Grid>
                            <Grid.Col span={2}>
                                <Avatar
                                    src={`/storage${candidato.logo_url}`}
                                    alt={candidato.logo_url}
                                    size="lg"
                                    radius="xl"
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <div>
                                    <TextSection fw={700} fz={16} ta="left">
                                        {candidato.nombre_candidato}
                                    </TextSection>
                                    <TextSection
                                        tt=""
                                        fw={500}
                                        fz={14}
                                        ta="left"
                                    >
                                        {candidato.nombre_organizacion}
                                    </TextSection>
                                </div>
                                <div>
                                    <TextSection
                                        tt=""
                                        fw={500}
                                        fz={14}
                                        ta="left"
                                    >
                                        Lista: {candidato.numero_organizacion}
                                    </TextSection>
                                </div>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <NumberInput
                                    hideControls
                                    min={0}
                                    size="xl"
                                    {...actaForm.getInputProps(
                                        `num_votos.${index}`
                                    )}
                                />
                            </Grid.Col>
                        </Grid>
                    </div>
                ))}
            </Card.Section>
        </Card>
    );
};
