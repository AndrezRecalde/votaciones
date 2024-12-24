import {
    Anchor,
    Box,
    Button,
    Center,
    Group,
    Paper,
    PasswordInput,
    Stack,
    rem,
} from "@mantine/core";
import { useUsuarioStore } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import classes from "../../../assets/styles/modules/user/ChangePwd.module.css";


export const ChangePwdForm = ({ form }) => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { startChangePwdUser } = useUsuarioStore();
    const navigate = useNavigate();
    const { paswrd } = form.values

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.values);
        startChangePwdUser(usuario.cdgo_usrio, paswrd);
        //console.log(usuario.cdgo_usrio, paswrd);
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <Stack>
                    <PasswordInput
                        label="Digita tu nueva contraseña"
                        {...form.getInputProps("paswrd")}
                    />
                    <PasswordInput
                        label="Confirma tu nueva contraseña"
                        {...form.getInputProps("paswrd_confirmed")}
                    />
                </Stack>
                <Group
                    justify="space-between"
                    mt="lg"
                    className={classes.controls}
                >
                    <Anchor component="button" onClick={() => navigate("/staff/d/profile")} c="dimmed" size="sm" className={classes.control}>
                        <Center inline>
                            <IconArrowLeft
                                style={{ width: rem(12), height: rem(12) }}
                                stroke={1.5}
                            />
                            <Box ml={5}>Regresar a mi perfil</Box>
                        </Center>
                    </Anchor>
                    <Button type="submit" className={classes.control}>
                        Cambiar contraseña
                    </Button>
                </Group>
            </Paper>
        </Box>
    );
};
