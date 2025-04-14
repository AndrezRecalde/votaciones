import { Box, Group, Paper, Progress, SimpleGrid, Text } from "@mantine/core";
import { TextSection } from "../../components";
import classes from "../../assets/styles/modules/profile/StatProgressActas.module.css";

export const ProfileProgressActas = ({ escrutinio }) => {
    const data = [
        {
            label: "Actas Ingresadas",
            count: escrutinio.total_ingresadas || 0,
            part: (escrutinio.porcentaje)?.toFixed(2) || 0,
            color: "#07d99a",
        },
        {
            label: "Actas No Ingresadas",
            count: 1413 - escrutinio.total_ingresadas,
            part: (100 - escrutinio.porcentaje)?.toFixed(2),
            color: "#03141a",
        },
    ];

    const segments = data.map((segment) => (
        <Progress.Section
            value={segment.part}
            color={segment.color}
            key={segment.color}
        >
            {segment.part > 10 && (
                <Progress.Label>{segment.part}%</Progress.Label>
            )}
        </Progress.Section>
    ));

    const descriptions = data.map((stat) => (
        <Box
            key={stat.label}
            style={{ borderBottomColor: stat.color }}
            className={classes.stat}
        >
            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
                {stat.label}
            </Text>

            <Group justify="space-between" align="flex-end" gap={0}>
                <Text fw={700}>{stat.count}</Text>
                <Text
                    c={stat.color}
                    fw={700}
                    size="sm"
                    className={classes.statCount}
                >
                    {stat.part}%
                </Text>
            </Group>
        </Box>
    ));

    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
                <TextSection tt="" fz="lg" fw={700}>
                    {escrutinio?.nombre_dignidad}
                </TextSection>
                <TextSection tt="" fz="lg" fw={700}>
                    {escrutinio?.total_ingresadas || 0} actas
                </TextSection>
            </Group>
            <Progress.Root
                size={34}
                classNames={{ label: classes.progressLabel }}
                mt={30}
            >
                {segments}
            </Progress.Root>
            <SimpleGrid cols={{ base: 1, xs: 2 }} mt="xl">
                {descriptions}
            </SimpleGrid>
        </Paper>
    );
};
