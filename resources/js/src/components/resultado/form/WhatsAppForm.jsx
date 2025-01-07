import {
    Box,
    Divider,
    rem,
    Select,
    Stack,
    Switch,
    Textarea,
    useMantineTheme,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useDignidadStore, useResultadoStore, useUiResultado } from "../../../hooks";
import { IconBrandTelegram, IconCheck, IconX } from "@tabler/icons-react";

export const WhatsAppForm = ({ form }) => {
    const { isMessage: checked } = form.values;
    const theme = useMantineTheme();
    const { startSendWhatsApp } = useResultadoStore();
    const { modalActionWhatsApp } = useUiResultado();
    const { dignidades } = useDignidadStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
        startSendWhatsApp(form.getValues());
        form.reset();
        modalActionWhatsApp(false);
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Divider my="xs" />
            <Stack>
                <Switch
                    {...form.getInputProps("isMessage")}
                    color="teal"
                    size="md"
                    label="Prefiero enviar un mensaje"
                    thumbIcon={
                        checked ? (
                            <IconCheck
                                style={{ width: rem(12), height: rem(12) }}
                                color={theme.colors.teal[6]}
                                stroke={3}
                            />
                        ) : (
                            <IconX
                                style={{ width: rem(12), height: rem(12) }}
                                color={theme.colors.red[6]}
                                stroke={3}
                            />
                        )
                    }
                />

                {checked ? (
                    <Textarea
                        required
                        label="Mensaje"
                        placeholder="Digite el mensaje"
                        {...form.getInputProps("message")}
                    />
                ) : (
                    <Select
                        label="Dignidad"
                        placeholder="Seleccione la dignidad"
                        searchable
                        withAsterisk
                        nothingFoundMessage="No options"
                        {...form.getInputProps("dignidad_id")}
                        data={dignidades.map((dignidad) => {
                            return {
                                label: dignidad.nombre_dignidad,
                                value: dignidad.id.toString(),
                            };
                        })}
                    />
                )}
                <BtnSubmit IconSection={IconBrandTelegram}>Enviar</BtnSubmit>
            </Stack>
        </Box>
    );
};
