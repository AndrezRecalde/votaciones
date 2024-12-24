import { Container, Group, Text, Title } from "@mantine/core";
import { BtnSection } from "../../components";
import { useNavigate } from "react-router-dom";
import { IconUserCircle } from "@tabler/icons-react";
import classes from "../../assets/styles/modules/error/NotFound.module.css";


const ErrorNotFound = () => {
    const navigate = useNavigate();

    const handleAction = () => {
        navigate("/staff/d/profile");
    };

    return (
        <Container className={classes.root}>
            <div className={classes.label}>404</div>
            <Title className={classes.title}>
                Has encontrado un lugar secreto.
            </Title>
            <Text
                c="dimmed"
                size="lg"
                ta="center"
                className={classes.description}
            >
                Lamentablemente, esta es solo una página 404. Puede que hayas
                escrito mal la dirección o la página se ha movido a otra URL.
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
    );
};

export default ErrorNotFound;
