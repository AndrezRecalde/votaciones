import { useEffect } from "react";
import { Box, Divider, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useGuessStore, useUiGuess } from "../../../hooks";

export const GuessForm = ({ form }) => {
    const { activateGuess, startAddGuess } = useGuessStore();
    const { modalActionGuess } = useUiGuess();

    useEffect(() => {
        if (activateGuess !== null) {
            form.setValues({
                ...activateGuess,
            });
            return;
        }
    }, [activateGuess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        startAddGuess(form.getValues());
        modalActionGuess(false);
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Divider my="xs" />
            <Stack>
                <TextInput
                    withAsterisk
                    label="Nombres del invitado"
                    placeholder="Digite los nombres completos"
                    {...form.getInputProps("nombres_completos")}
                />
                <TextInput
                    withAsterisk
                    label="Teléfono"
                    placeholder="Digite el número de teléfono"
                    {...form.getInputProps("telefono")}
                />
                <TextInput
                    withAsterisk
                    label="Código"
                    placeholder="Digite el código"
                    {...form.getInputProps("codigo")}
                />
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
