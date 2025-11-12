import { Paper } from "@mantine/core";
import { AuthForm, Logo, TextSection, TitlePage } from "../../components";
import { useTitleHook } from "../../hooks";
import classes from "../../assets/styles/modules/auth/AuthPageBackground.module.css";

const AuthPage = () => {
    useTitleHook("Elecciones - Acceder");

    return (
        <div className={classes.wrapper}>
            <TitlePage ta="center" className={classes.title}>
                Sistema de Elecciones
            </TitlePage>
            <Logo height={30} width={80} />
            <Paper
                withBorder
                shadow="md"
                p={30}
                mt={20}
                radius="md"
                className={classes.wrapper_paper}
            >
                <TextSection tt="" ta="center" fs="italic" color="black" fz={14} fw={500} mb={10}>
                    Referemdum / Consulta Popular 2025
                </TextSection>
                <TextSection tt="" color="black" fz={20} fw={600} mb={20}>
                    Iniciar sesión
                </TextSection>
                <AuthForm />
            </Paper>
        </div>
    );
};

export default AuthPage;
