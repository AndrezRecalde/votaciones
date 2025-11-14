import { useEffect } from "react";
import {
    Box,
    Divider,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../../components";
import { usePreguntaStore, useUiPregunta } from "../../../../hooks";

export const PreguntaForm = ({ form }) => {
    const {
        isLoading,
        activatePregunta,
        startAddPregunta,
        setActivatePregunta,
    } = usePreguntaStore();
    const { modalActionPregunta } = useUiPregunta();

    useEffect(() => {
        if (activatePregunta !== null) {
            form.setValues({
                ...activatePregunta,
                descripcion: activatePregunta.descripcion || "",
            });
        }
    }, [activatePregunta]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await startAddPregunta(form.values);
        modalActionPregunta(false);
        setActivatePregunta(null);
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
                    label="Casillero de la pregunta"
                    placeholder="Digite el casillero de la pregunta"
                    {...form.getInputProps("casillero_pregunta")}
                />
                <TextInput
                    withAsterisk
                    label="Texto de la pregunta"
                    placeholder="Digite el texto de la pregunta"
                    {...form.getInputProps("texto_pregunta")}
                />
                <Textarea
                    resize="vertical"
                    label="Descripción de la pregunta"
                    placeholder="Digite la descripción de la pregunta"
                    {...form.getInputProps("descripcion")}
                />
                <BtnSubmit loading={isLoading}>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
