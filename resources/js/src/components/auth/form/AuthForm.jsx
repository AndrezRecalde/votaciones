import { useEffect } from "react";
import { useForm } from "@mantine/form";
import {
    Box,
    Checkbox,
    Group,
    LoadingOverlay,
    PasswordInput,
    Stack,
    TextInput,
    UnstyledButton,
} from "@mantine/core";
import { AlertSection, BtnSubmit } from "../../../components";
import { useAuthStore } from "../../../hooks";
import { IconChevronsRight } from "@tabler/icons-react";

export const AuthForm = () => {
    const { isLoading, startLogin, validate, errores } = useAuthStore();
    //const { modalActionRegisterUser } = useUiAuth();

    const form = useForm({
        initialValues: {
            dni: "",
            password: "",
            remember: true,
        },
    });

    useEffect(() => {
        if (validate !== undefined) {
            form.setErrors(validate);
            return;
        }

        return () => {
            form.clearErrors();
        };
    }, [validate]);

    const handleLogin = (e) => {
        e.preventDefault();
        //startLogin(form.values);
        startLogin(form.getValues());
        //navigate("/u/profile", { replace: true })
    };

    return (
        <Box
            pos="relative"
            component="form"
            onSubmit={form.onSubmit((_, e) => handleLogin(e))}
        >
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Stack>
                <TextInput
                    label="Usuario"
                    placeholder="Digite su usuario"
                    {...form.getInputProps("dni")}
                />
                <PasswordInput
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    {...form.getInputProps("password")}
                />
                {errores ? (
                    <AlertSection
                        variant="light"
                        color="red.8"
                        title="Error"
                    >
                        {errores}
                    </AlertSection>
                ) : null}
                <Group justify="space-between" mt="lg">
                    <Checkbox
                        label="Recuerdame"
                        {...form.getInputProps("remember", {
                            type: "checkbox",
                        })}
                    />
                    {/* <UnstyledButton onClick={() => modalActionRegisterUser(true)}>
                        Registrarme
                    </UnstyledButton> */}
                </Group>
                <BtnSubmit IconSection={IconChevronsRight}>Acceder</BtnSubmit>
            </Stack>
        </Box>
    );
};
