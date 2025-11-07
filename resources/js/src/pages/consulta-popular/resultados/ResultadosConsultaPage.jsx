import { useEffect, useMemo } from "react";
import {
    ActionIcon,
    Container,
    Divider,
    Grid,
    Group,
    rem
} from "@mantine/core";
import { ResultadosConsultaFilter, TitlePage } from "../../../components";
import { useActaConsultaStore, useFechaStore } from "../../../hooks";
import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react";
import Swal from "sweetalert2";

const ResultadosConsultaPage = () => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);
    const { errores } = useActaConsultaStore();
    const { fechaActual } = useFechaStore();

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                title: "Opps...",
                text: errores,
                confirmButtonColor: "#094293",
            });
            return;
        }
    }, [errores]);

    return (
        <Container size={1600}>
            <Group justify="space-between">
                <TitlePage order={2}>
                    Resultados de Consulta Popular - 2025
                </TitlePage>
                <Group>
                    <ActionIcon
                        size={42}
                        variant="default"
                        aria-label="download-xls"
                        onClick={(e) => handleOpenExportPDF(e)}
                    >
                        <IconFileTypePdf
                            style={{ width: rem(24), height: rem(24) }}
                        />
                    </ActionIcon>
                    <ActionIcon
                        size={42}
                        variant="default"
                        aria-label="download-xls"
                        onClick={(e) => handleOpenExportXLS(e)}
                    >
                        <IconFileTypeXls
                            style={{ width: rem(24), height: rem(24) }}
                        />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider my="md" />
            <Grid >
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 3, lg: 3 }}>
                    <ResultadosConsultaFilter usuario={usuario} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 9, lg: 9 }}>
                    Resultados
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default ResultadosConsultaPage;
