import { Title, Text, Container, Group } from "@mantine/core";
import { BtnSection } from "../../components";
import { useNavigate } from "react-router-dom";
import { IconUserCircle } from "@tabler/icons-react";
import classes from "../../assets/styles/modules/error/Forbidden.module.css";

const ErrorAccessDenied = () => {
    const navigate = useNavigate();
    const handleAction = () => {
        navigate("/staff/d/profile");
    };

    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.label}>403</div>
                <Title className={classes.title}>
                    El accesso a esta página esta restringida...
                </Title>
                <Text size="lg" ta="center" className={classes.description}>
                    Consulte con el administrador del sitio si cree que se trata
                    de un error.
                </Text>
                <Group justify="center">
                    <BtnSection
                        heigh={50}
                        fontSize={18}
                        handleAction={handleAction}
                        IconSection={IconUserCircle}
                    >
                        Ir a mi perfil
                    </BtnSection>
                </Group>
            </Container>
        </div>
    );
};

export default ErrorAccessDenied;
