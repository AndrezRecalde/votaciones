import { ActionIcon, Card, Grid, Tooltip } from "@mantine/core";
import { IconRotate2 } from "@tabler/icons-react";
import { BtnSubmit } from "../../../../components";

export const ActaAccionesBtnSection = () => {

    const handleResetSearch = () => {
        console.log('clic');
    };

    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Grid gutter="md">
                <Grid.Col span={2}>
                    <Tooltip
                        label="Reiniciar búsqueda"
                        position="top"
                        withArrow
                    >
                        <ActionIcon
                            mt={15}
                            variant="light"
                            color="gray"
                            radius="md"
                            size={50}
                            onClick={handleResetSearch}
                            style={{ width: "100%" }}
                        >
                            <IconRotate2 size={24} />
                        </ActionIcon>
                    </Tooltip>
                </Grid.Col>
                <Grid.Col span={10}>
                    <BtnSubmit height={50}>Ingresar Acta</BtnSubmit>
                </Grid.Col>
            </Grid>
        </Card>
    );
};
