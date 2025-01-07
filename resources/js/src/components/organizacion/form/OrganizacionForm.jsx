import {
    Box,
    ColorInput,
    Divider,
    FileInput,
    Group,
    Image,
    NumberInput,
    rem,
    Stack,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useOrganizacionStore, useUiOrganizacion } from "../../../hooks";
import { useCallback, useEffect, useState } from "react";
import { IconPhoto } from "@tabler/icons-react";

export const OrganizacionForm = ({ form }) => {
    const { activateOrganizacion, startAddOrganizacion } =
        useOrganizacionStore();
    const { modalActionOrganizacion } = useUiOrganizacion();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const icon = (
        <IconPhoto style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
    );

    useEffect(() => {
        if (activateOrganizacion !== null) {
            form.setValues({
                ...activateOrganizacion,
            });
            const imageUrl = "/storage" + activateOrganizacion?.logo_url;
            setPreview(imageUrl);

            fetch(imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const file = new File(
                        [blob],
                        "/storage" + activateOrganizacion.logo_url,
                        { type: blob.type }
                    );
                    setFile(file);
                    form.setFieldValue("logo_url", file);
                });
            return;
        }
    }, [activateOrganizacion]);

    const handleImageChange = useCallback((file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setFile(file);
        } else {
            setPreview(null);
            setFile(null);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        startAddOrganizacion(form.getValues());
        modalActionOrganizacion(false);
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
                    label="Nombres de la organización"
                    placeholder="Digite el nombre de la organización"
                    {...form.getInputProps("nombre_organizacion")}
                />
                <NumberInput
                    label="Número organización"
                    placeholder="Digite el número de organización"
                    {...form.getInputProps("numero_organizacion")}
                />
                <TextInput
                    withAsterisk
                    label="Sigla"
                    placeholder="Digite la sigla"
                    {...form.getInputProps("sigla")}
                />
                <ColorInput
                    label="Color de organización"
                    placeholder="Digite el color de la organización"
                    {...form.getInputProps("color")}
                />
                <FileInput
                    withAsterisk
                    label="Logo"
                    placeholder="Logo de la organización"
                    accept="image/png,image/jpeg,image/jpeg"
                    leftSection={icon}
                    {...form.getInputProps("logo_url")}
                    onChange={(file) => {
                        form.setFieldValue("logo_url", file);
                        handleImageChange(file);
                    }}
                />
                {preview && (
                    <Group position="center">
                        <Image
                            src={preview}
                            alt="logo org"
                            fit="contain"
                            maw={100}
                        />
                    </Group>
                )}
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
