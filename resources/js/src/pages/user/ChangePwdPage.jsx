import { Container } from "@mantine/core";
import { ChangePwdForm, TextSection, TitlePage } from "../../components";
import { useTitleHook } from "../../hooks";
import { useUsuarioStore } from "../../hooks";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ChangePwdPage = () => {
    useTitleHook("Helpdesk | Cambio contrasena");
    const { message, errores } = useUsuarioStore();

    const form = useForm({
        initialValues: {
            paswrd: "",
            paswrd_confirmed: "",
        },
        validate: {
            paswrd_confirmed: (value, values) =>
                value !== values.paswrd
                    ? "Las contraseñas no coinciden"
                    : null,
        },
    });

    useEffect(() => {
        if (message !== undefined) {
            Swal.fire({
                icon: message.status,
                text: message.msg,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
    }, [message]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                title: "Opps..",
                text: errores,
                showConfirmButton: false,
            });
            return;
        }
    }, [errores]);

    return (
        <Container size={560} my={30}>
            <TitlePage fw={900} order={2} ta="center">
                Cambiar Contraseña
            </TitlePage>
            <TextSection color="dimmed" tt="" fz={16} ta="center">
                Ingresa tu nueva contraseña y verificala.
            </TextSection>
            <ChangePwdForm form={form} />
        </Container>
    );
};

export default ChangePwdPage;
