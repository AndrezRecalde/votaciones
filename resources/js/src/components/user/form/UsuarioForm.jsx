import { useEffect } from "react";
import {
    Box,
    Divider,
    Select,
    SimpleGrid,
    Stack,
    Switch,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../../components";
import {
    useJurisdiccionStore,
    useRoleStore,
    useUiUsuario,
    useUsuarioStore,
} from "../../../hooks";

export const UsuarioForm = ({ form }) => {
    const { provincia_id, es_cantonal } = form.values;

    const { activateUsuario, startAddUsuario } = useUsuarioStore();
    const { modalActionUsuario } = useUiUsuario();
    const { roles } = useRoleStore();
    const { provincias, startLoadCantones, cantones } = useJurisdiccionStore();
    const convertToString = (value) =>
        value !== null && value !== undefined ? value.toString() : null;

    useEffect(() => {
        startLoadCantones({ provincia_id });
        form.setFieldValue(
            "canton_id",
            activateUsuario?.canton_id
                ? activateUsuario?.canton_id.toString()
                : null
        );
    }, [provincia_id]);

    useEffect(() => {
        if (activateUsuario !== null) {
            const { role_id, provincia_id, canton_id } = activateUsuario;

            form.setValues({
                ...activateUsuario,
                role: convertToString(role_id),
                provincia_id: convertToString(provincia_id),
                canton_id: convertToString(canton_id),
            });

            form.setFieldValue(
                "es_cantonal",
                activateUsuario.canton_id ? true : false
            );
            return;
        }
    }, [activateUsuario]);

    const handleSubmit = (e) => {
        e.preventDefault();
        startAddUsuario(form.getTransformedValues());
        modalActionUsuario(false);
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
                    label="Nombres completos"
                    placeholder="Digite los nombres completos"
                    {...form.getInputProps("nombres_completos")}
                />
                <TextInput
                    withAsterisk
                    label="Cédula"
                    placeholder="Digite la cédula"
                    {...form.getInputProps("dni")}
                />
                <Select
                    label="Role"
                    placeholder="Seleccione el role"
                    searchable
                    withAsterisk
                    nothingFoundMessage="No options"
                    {...form.getInputProps("role")}
                    data={roles.map((role) => {
                        return {
                            label: role.name,
                            value: role.id.toString(),
                        };
                    })}
                />
                <Select
                    withAsterisk
                    searchable
                    label="Provincia"
                    placeholder="Seleccione la provincia"
                    nothingFoundMessage="No options"
                    {...form.getInputProps("provincia_id")}
                    data={provincias?.map((provincia) => {
                        return {
                            label: provincia.nombre_provincia,
                            value: provincia.id.toString(),
                        };
                    })}
                />
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }}>
                    <Switch
                        color="indigo.4"
                        label="¿Es cantonal?"
                        size="md"
                        {...form.getInputProps("es_cantonal", {
                            type: "checkbox",
                        })}
                    />
                    <Switch
                        color="indigo.4"
                        label="¿Es Responsable?"
                        size="md"
                        {...form.getInputProps("es_responsable", {
                            type: "checkbox",
                        })}
                    />
                </SimpleGrid>
                {es_cantonal ? (
                    <Select
                        searchable
                        label="Cantón"
                        placeholder="Seleccione el cantón"
                        nothingFoundMessage="No options"
                        {...form.getInputProps("canton_id")}
                        data={cantones?.map((canton) => {
                            return {
                                label: canton.nombre_canton,
                                value: canton.id.toString(),
                            };
                        })}
                    />
                ) : null}
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
