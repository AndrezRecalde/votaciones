import { useEffect, useMemo, useState } from "react";
import {
    Container,
    Paper,
    Title,
    Text,
    Accordion,
    Badge,
    Group,
    Stack,
    Progress,
    Card,
    Grid,
    Loader,
    Center,
    Alert,
    Box,
    Flex,
} from "@mantine/core";
import {
    IconChevronDown,
    IconMapPin,
    IconBuilding,
    IconHome,
    IconUsers,
    IconCheck,
    IconX,
    IconAlertCircle,
} from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEscrutinioConsultaStore } from "../../../hooks";

const ReporteJuntasProvinciaPage = () => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { startLoadReporteProvincia, startClearEscrutinioConsulta, reporte } =
        useEscrutinioConsultaStore();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await startLoadReporteProvincia(usuario.provincia_id);
            setIsLoading(false);
        };

        loadData();

        return () => {
            startClearEscrutinioConsulta();
        };
    }, []);

    // Estadísticas generales
    const StatsCard = ({ title, value, color, icon: Icon }) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
                <Box>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                        {title}
                    </Text>
                    <Text fw={700} size="xl" mt="xs">
                        {value}
                    </Text>
                </Box>
                <Icon size={32} color={color} stroke={1.5} />
            </Group>
        </Card>
    );

    // Componente para mostrar la tabla de juntas de un recinto
    const JuntasTable = ({ juntas }) => {
        const columns = useMemo(
            () => [
                {
                    accessorKey: "junta_nombre",
                    header: "Junta",
                    size: 100,
                    Cell: ({ row }) => (
                        <Group gap="xs">
                            <Badge
                                color={
                                    row.original.genero === "F"
                                        ? "pink"
                                        : "blue"
                                }
                                variant="light"
                                size="lg"
                            >
                                {row.original.junta_nombre}
                            </Badge>
                        </Group>
                    ),
                },
                {
                    accessorKey: "cne_cod_junta",
                    header: "Código CNE",
                    size: 150,
                },
                {
                    accessorKey: "num_electores_cne",
                    header: "Electores",
                    size: 100,
                    Cell: ({ cell }) => (
                        <Text fw={500}>
                            {cell.getValue()?.toLocaleString() || "N/A"}
                        </Text>
                    ),
                },
                {
                    accessorKey: "tiene_acta",
                    header: "Estado",
                    size: 120,
                    Cell: ({ row }) => (
                        <Group gap="xs">
                            {row.original.tiene_acta ? (
                                <Badge
                                    color="green"
                                    variant="filled"
                                    leftSection={<IconCheck size={14} />}
                                >
                                    Con Acta
                                </Badge>
                            ) : (
                                <Badge
                                    color="red"
                                    variant="filled"
                                    leftSection={<IconX size={14} />}
                                >
                                    Sin Acta
                                </Badge>
                            )}
                        </Group>
                    ),
                },
                {
                    accessorKey: "votos_validos",
                    header: "Votos Válidos",
                    size: 120,
                    Cell: ({ cell, row }) =>
                        row.original.tiene_acta ? (
                            <Text fw={600} c="blue">
                                {cell.getValue()?.toLocaleString() || "0"}
                            </Text>
                        ) : (
                            <Text c="dimmed">-</Text>
                        ),
                },
                {
                    accessorKey: "usuario_ingreso",
                    header: "Usuario",
                    size: 150,
                    Cell: ({ cell, row }) =>
                        row.original.tiene_acta ? (
                            <Text size="sm">{cell.getValue() || "N/A"}</Text>
                        ) : (
                            <Text c="dimmed">-</Text>
                        ),
                },
                {
                    accessorKey: "acta_fecha_ingreso",
                    header: "Fecha Ingreso",
                    size: 180,
                    Cell: ({ cell, row }) =>
                        row.original.tiene_acta ? (
                            <Text size="sm">
                                {cell.getValue()
                                    ? new Date(cell.getValue()).toLocaleString(
                                          "es-ES",
                                          {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          }
                                      )
                                    : "N/A"}
                            </Text>
                        ) : (
                            <Text c="dimmed">-</Text>
                        ),
                },
            ],
            []
        );

        const table = useMantineReactTable({
            columns,
            data: juntas,
            enableColumnActions: false,
            enableColumnFilters: false,
            enablePagination: false,
            enableSorting: true,
            enableBottomToolbar: false,
            enableTopToolbar: false,
            mantineTableProps: {
                striped: true,
                highlightOnHover: true,
                withColumnBorders: true,
            },
            mantineTableBodyRowProps: ({ row }) => ({
                style: {
                    backgroundColor: row.original.tiene_acta
                        ? "rgba(34, 139, 34, 0.05)"
                        : "rgba(255, 0, 0, 0.05)",
                },
            }),
        });

        return <MantineReactTable table={table} />;
    };

    // Renderizar recintos con sus juntas
    const RecintoSection = ({ recinto }) => (
        <Paper p="md" withBorder mb="sm" radius="md">
            <Stack gap="md">
                <Flex
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    gap="md"
                >
                    <Box style={{ flex: 1, minWidth: 250 }}>
                        <Group gap="xs" mb={4}>
                            <IconHome size={20} color="#228be6" />
                            <Text fw={600} size="md">
                                {recinto.nombre_recinto || "Sin Recinto"}
                            </Text>
                        </Group>
                        {recinto.direccion_recinto && (
                            <Text size="sm" c="dimmed" ml={28}>
                                {recinto.direccion_recinto}
                            </Text>
                        )}
                    </Box>
                    <Group gap="xs">
                        <Badge color="blue" variant="light">
                            {recinto.total_juntas} juntas
                        </Badge>
                        <Badge color="green" variant="light">
                            {recinto.juntas_con_acta} con acta
                        </Badge>
                        <Badge color="red" variant="light">
                            {recinto.juntas_sin_acta} sin acta
                        </Badge>
                    </Group>
                </Flex>

                <JuntasTable juntas={recinto.juntas} />
            </Stack>
        </Paper>
    );

    // Renderizar zonas
    const ZonaAccordion = ({ zona, parroquiaId, cantonId }) => (
        <Accordion.Item
            value={`zona-${cantonId}-${parroquiaId}-${zona.zona_id}`}
        >
            <Accordion.Control>
                <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap="sm"
                    mr="xl"
                >
                    <Group gap="xs">
                        <IconMapPin size={18} />
                        <Text fw={500}>{zona.nombre_zona}</Text>
                    </Group>
                    <Group gap="xs">
                        <Badge size="sm" color="blue" variant="light">
                            {zona.total_juntas} juntas
                        </Badge>
                        <Badge size="sm" color="green" variant="light">
                            {zona.juntas_con_acta} con acta
                        </Badge>
                        <Progress.Root size="xl" style={{ width: 150 }}>
                            <Progress.Section
                                value={
                                    zona.total_juntas > 0
                                        ? (zona.juntas_con_acta /
                                              zona.total_juntas) *
                                          100
                                        : 0
                                }
                                color="green"
                            >
                                <Progress.Label>
                                    {zona.total_juntas > 0
                                        ? Math.round(
                                              (zona.juntas_con_acta /
                                                  zona.total_juntas) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </Progress.Label>
                            </Progress.Section>
                        </Progress.Root>
                    </Group>
                </Flex>
            </Accordion.Control>
            <Accordion.Panel>
                <Stack gap="md">
                    {zona.recintos.map((recinto) => (
                        <RecintoSection
                            key={
                                recinto.recinto_id ||
                                `no-recinto-${Math.random()}`
                            }
                            recinto={recinto}
                        />
                    ))}
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    );

    // Renderizar parroquias
    const ParroquiaAccordion = ({ parroquia, cantonId }) => (
        <Accordion.Item
            value={`parroquia-${cantonId}-${parroquia.parroquia_id}`}
        >
            <Accordion.Control>
                <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap="sm"
                    mr="xl"
                >
                    <Group gap="xs">
                        <IconBuilding size={15} />
                        <Text fw={500} component="span">
                            {parroquia.nombre_parroquia}
                        </Text>
                        <Badge
                            size="xs"
                            variant="dot"
                            color={
                                parroquia.tipo_parroquia === "U"
                                    ? "blue"
                                    : "green"
                            }
                        >
                            {parroquia.tipo_parroquia === "U"
                                ? "Urbana"
                                : "Rural"}
                        </Badge>
                    </Group>
                    <Group gap="xs">
                        <Badge color="blue" variant="light">
                            {parroquia.total_juntas} juntas
                        </Badge>
                        <Badge color="green" variant="light">
                            {parroquia.juntas_con_acta} con acta
                        </Badge>
                    </Group>
                </Flex>
            </Accordion.Control>
            <Accordion.Panel>
                <Accordion
                    chevron={<IconChevronDown size={16} />}
                    variant="separated"
                >
                    {parroquia.zonas.map((zona) => (
                        <ZonaAccordion
                            key={zona.zona_id}
                            zona={zona}
                            parroquiaId={parroquia.parroquia_id}
                            cantonId={cantonId}
                        />
                    ))}
                </Accordion>
            </Accordion.Panel>
        </Accordion.Item>
    );

    // Renderizar cantones
    const CantonCard = ({ canton }) => (
        <Paper shadow="xs" p="lg" radius="md" withBorder mb="xl">
            <Stack gap="md">
                <Flex
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    gap="md"
                >
                    <Box>
                        <Text size="xl" fw={700} c="blue">
                            {canton.nombre_canton}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Cantón
                        </Text>
                    </Box>
                    <Group gap="md">
                        <Box style={{ textAlign: "center" }}>
                            <Text size="sm" c="dimmed">
                                Total Juntas
                            </Text>
                            <Text size="xl" fw={700}>
                                {canton.total_juntas}
                            </Text>
                        </Box>
                        <Box style={{ textAlign: "center" }}>
                            <Text size="sm" c="dimmed">
                                Con Acta
                            </Text>
                            <Text size="xl" fw={700} c="green">
                                {canton.juntas_con_acta}
                            </Text>
                        </Box>
                        <Box style={{ textAlign: "center" }}>
                            <Text size="sm" c="dimmed">
                                Sin Acta
                            </Text>
                            <Text size="xl" fw={700} c="red">
                                {canton.juntas_sin_acta}
                            </Text>
                        </Box>
                    </Group>
                </Flex>

                <Progress
                    value={canton.porcentaje_avance}
                    size="xl"
                    radius="xl"
                    color={
                        canton.porcentaje_avance >= 75
                            ? "green"
                            : canton.porcentaje_avance >= 50
                            ? "yellow"
                            : "red"
                    }
                >
                    <Progress.Label>
                        {canton.porcentaje_avance}% completado
                    </Progress.Label>
                </Progress>

                <Accordion
                    chevron={<IconChevronDown size={18} />}
                    variant="contained"
                >
                    {canton.parroquias.map((parroquia) => (
                        <ParroquiaAccordion
                            key={parroquia.parroquia_id}
                            parroquia={parroquia}
                            cantonId={canton.canton_id}
                        />
                    ))}
                </Accordion>
            </Stack>
        </Paper>
    );

    if (isLoading) {
        return (
            <Container size="xl" py="xl">
                <Center h={400}>
                    <Stack align="center" gap="md">
                        <Loader size="xl" />
                        <Text size="lg" c="dimmed">
                            Cargando reporte...
                        </Text>
                    </Stack>
                </Center>
            </Container>
        );
    }

    if (!reporte || !reporte.provincia_id) {
        return (
            <Container size="xl" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Sin datos"
                    color="yellow"
                >
                    No se encontraron datos para la provincia seleccionada.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            {/* Header */}
            <Paper shadow="sm" p="md" radius="md" mb="xl" withBorder>
                <Group justify="space-between">
                    <Box>
                        <Title order={3} mb="xs">
                            {reporte.nombre_provincia}
                        </Title>
                        <Text size="md" c="dimmed">
                            Reporte de Juntas Electorales - Consulta Popular
                        </Text>
                    </Box>
                </Group>
            </Paper>

            {/* Estadísticas Generales */}
            <Grid mb="xl">
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <StatsCard
                        title="Total Juntas"
                        value={reporte.total_juntas}
                        color="#228be6"
                        icon={IconUsers}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <StatsCard
                        title="Con Acta"
                        value={reporte.juntas_con_acta}
                        color="#51cf66"
                        icon={IconCheck}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <StatsCard
                        title="Sin Acta"
                        value={reporte.juntas_sin_acta}
                        color="#ff6b6b"
                        icon={IconX}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 12, md: 12 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between">
                            <Box>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={500}
                                    tt="uppercase"
                                >
                                    Avance
                                </Text>
                                <Text fw={700} size="xl" mt="xs">
                                    {reporte.porcentaje_avance}%
                                </Text>
                            </Box>
                        </Group>
                        <Progress
                            value={reporte.porcentaje_avance}
                            color={
                                reporte.porcentaje_avance >= 75
                                    ? "green"
                                    : reporte.porcentaje_avance >= 50
                                    ? "yellow"
                                    : "red"
                            }
                            size="lg"
                            radius="xl"
                            mt="md"
                        />
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Cantones */}
            <Title order={2} mb="lg">
                Cantones ({reporte.cantones.length})
            </Title>
            {reporte.cantones.map((canton) => (
                <CantonCard key={canton.canton_id} canton={canton} />
            ))}
        </Container>
    );
};

export default ReporteJuntasProvinciaPage;
