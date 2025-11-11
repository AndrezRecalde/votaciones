import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Badge,
    Box,
    Divider,
    Group,
    Paper,
    Select,
    SimpleGrid,
    Switch,
    Text,
    useMantineColorScheme,
    useMantineTheme,
    Progress,
    Stack,
    rem,
    rgba,
} from "@mantine/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useResultadoConsultaStore } from "../../../../hooks";

/* ===================== PALETA (colores elegantes y sobrios) ===================== */
const COLORS = {
    si: "#2563eb", // azul clásico institucional
    no: "#dc2626", // rojo oscuro elegante
    blancos: "#6b7280", // gris medio
    nulos: "#1e293b", // gris carbón profundo
};

/* ===================== FORMATTERS ===================== */
const nf = new Intl.NumberFormat("es-EC");
const pf = new Intl.NumberFormat("es-EC", {
    style: "percent",
    maximumFractionDigits: 1,
});
const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

/* ===================== SUBCOMPONENTES UI MEJORADOS ===================== */
function KPI({ label, value, subtitle, color }) {
    const theme = useMantineTheme();

    return (
        <Paper
            withBorder
            radius="sm"
            p="sm"
            shadow="md"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minHeight: 120,
                borderLeft: `4px solid black`,
            }}
        >
            <Text fz={12} fw={600} c="dimmed" tt="uppercase">
                {label}
            </Text>
            <Text
                fz={18}
                fw={900}
                style={{
                    fontSize: "1.3rem",
                    lineHeight: 1,
                }}
            >
                {value}
            </Text>
            {subtitle && (
                <Text fz={12} c="dimmed" fw={500}>
                    {subtitle}
                </Text>
            )}
        </Paper>
    );
}

function KPIWithProgress({ label, current, total, color }) {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <Paper
            withBorder
            radius="sm"
            p="sm"
            shadow="md"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minHeight: 120,
                borderLeft: `4px solid black`,
            }}
        >
            <Text fz={12} fw={600} c="dimmed" tt="uppercase">
                {label}
            </Text>

            <Stack gap={8}>
                <Group justify="space-between" align="baseline">
                    <Text
                        fz={18}
                        fw={900}
                        style={{
                            fontSize: "1.3rem",
                            lineHeight: 1,
                        }}
                    >
                        {nf.format(current)}
                    </Text>
                    <Text fz={14} c="dimmed" fw={500}>
                        de {nf.format(total)}
                    </Text>
                </Group>

                <Box>
                    <Progress
                        value={percentage}
                        color={color}
                        size="sm"
                        radius="xl"
                        style={{
                            backgroundColor: rgba(color, 0.2),
                        }}
                    />
                    <Text
                        size="xs"
                        fw={700}
                        ta="center"
                        mt={4}
                        style={{ color: color }}
                    >
                        {pf.format(percentage / 100)}
                    </Text>
                </Box>
            </Stack>
        </Paper>
    );
}

/* ===================== COMPONENTE PRINCIPAL ===================== */
export const ResultadosConsultaChart = () => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    const {
        loading,
        loadingResultados,
        numero_electores,
        totales,
        resultados,
    } = useResultadoConsultaStore();

    const [stacked, setStacked] = useState(false);
    const [sortBy, setSortBy] = useState("casillero");

    // Colores adaptados al theme de Mantine
    const themeColors = useMemo(
        () => ({
            grid: isDark ? "#374151" : "#e5e7eb",
            border: isDark ? "#4b5563" : "#d1d5db",
            panel: isDark ? "#1f2937" : "#ffffff",
            panelAlt: isDark ? "#374151" : "#f9fafb",
            text: isDark ? "#f9fafb" : "#111827",
            dim: isDark ? "#9ca3af" : "#6b7280",
        }),
        [isDark, theme]
    );

    /* Agregados globales */
    const totalElectores = toNum(
        numero_electores?.total_electores ??
            numero_electores?.total_num_electores
    );
    const totalValidos = toNum(totales?.total_votos_validos);
    const totalBlancos = toNum(totales?.total_votos_blancos);
    const totalNulos = toNum(totales?.total_votos_nulos);

    const pctBlancos = totalValidos > 0 ? totalBlancos / totalValidos : 0;
    const pctNulos = totalValidos > 0 ? totalNulos / totalValidos : 0;

    /* Normalizar filas */
    const rows = useMemo(() => {
        const list = Array.isArray(resultados) ? resultados : [];
        return list.map((r) => {
            const si = toNum(r.total_votos_si);
            const no = toNum(r.total_votos_no);
            const blancos = toNum(r.total_votos_blancos);
            const nulos = toNum(r.total_votos_nulos);
            const validos = toNum(r.total_votos_validos);
            return {
                casillero: r.casillero_pregunta ?? String(r.pregunta_id),
                texto: r.texto_pregunta ?? "",
                si,
                no,
                blancos,
                nulos,
                validos,
                p_si: validos ? si / validos : 0,
                p_no: validos ? no / validos : 0,
                p_blancos: validos ? blancos / validos : 0,
                p_nulos: validos ? nulos / validos : 0,
                ruido: validos ? (blancos + nulos) / validos : 0,
            };
        });
    }, [resultados]);

    /* Ordenamiento */
    const sorted = useMemo(() => {
        const arr = [...rows];
        switch (sortBy) {
            case "si":
                arr.sort((a, b) => b.si - a.si);
                break;
            case "no":
                arr.sort((a, b) => b.no - a.no);
                break;
            case "ruido":
                arr.sort((a, b) => b.ruido - a.ruido);
                break;
            case "p_si":
                arr.sort((a, b) => b.p_si - a.p_si);
                break;
            case "casillero":
            default:
                arr.sort((a, b) =>
                    String(a.casillero).localeCompare(String(b.casillero), "es")
                );
        }
        return arr;
    }, [rows, sortBy]);

    const categories = sorted.map((r) => r.casillero);
    const stacking = stacked ? "normal" : undefined;

    /* Series generadora (horizontal bar) - COLORES ELEGANTES */
    const makeSeries = (key, percentKey, name, color) => ({
        name,
        color: color,
        data: sorted.map((r, idx) => ({
            y: r[key],
            abs: r[key],
            percent: r[percentKey],
            validos: r.validos,
            texto: r.texto,
            casillero: r.casillero,
            index: idx,
        })),
    });

    const series = useMemo(
        () => [
            makeSeries("si", "p_si", "SI", COLORS.si),
            makeSeries("no", "p_no", "NO", COLORS.no),
            makeSeries("blancos", "p_blancos", "Blancos", COLORS.blancos),
            makeSeries("nulos", "p_nulos", "Nulos", COLORS.nulos),
        ],
        [sorted]
    );

    /* Opciones gráfico barras horizontales - ESTILO ELEGANTE Y SOBRIO */
    const barOptions = useMemo(
        () => ({
            chart: {
                type: "bar",
                height: 480,
                backgroundColor: "transparent",
                style: {
                    fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif",
                },
                spacingTop: 20,
                spacingBottom: 20,
                spacingLeft: 10,
                spacingRight: 10,
            },
            title: { text: undefined },
            xAxis: {
                categories,
                gridLineWidth: 0,
                lineColor: themeColors.border,
                lineWidth: 1,
                tickLength: 0,
                labels: {
                    style: {
                        fontSize: "20px",
                        fontWeight: "900",
                        color: themeColors.text,
                    },
                },
            },
            yAxis: {
                min: 0,
                gridLineColor: themeColors.grid,
                gridLineWidth: 1,
                lineWidth: 0,
                title: {
                    text: "Cantidad de Votos",
                    style: {
                        fontSize: "16px",
                        fontWeight: "600",
                        color: themeColors.dim,
                    },
                },
                labels: {
                    style: {
                        fontSize: "12px",
                        color: themeColors.dim,
                        fontWeight: "500",
                    },
                    formatter: function () {
                        return nf.format(this.value);
                    },
                },
            },
            legend: {
                align: "center",
                verticalAlign: "top",
                itemStyle: {
                    fontWeight: "500",
                    fontSize: "12px",
                    color: themeColors.text,
                },
                itemHoverStyle: {
                    color: isDark ? "#ffffff" : "#000000",
                },
                symbolRadius: 4,
                symbolHeight: 12,
                symbolWidth: 12,
                itemDistance: 20,
                padding: 12,
                backgroundColor: themeColors.panelAlt,
                borderColor: themeColors.border,
                borderWidth: 1,
                borderRadius: 6,
                shadow: false,
            },
            tooltip: {
                shared: false,
                useHTML: true,
                borderRadius: 5,
                borderWidth: 1,
                backgroundColor: themeColors.panel,
                borderColor: themeColors.border,
                padding: 12,
                shadow: {
                    color: "rgba(0, 0, 0, 0.1)",
                    offsetX: 0,
                    offsetY: 2,
                    opacity: 0.15,
                    width: 4,
                },
                style: {
                    fontSize: "12px",
                    color: themeColors.text,
                },
                formatter: function () {
                    const point = this.point;
                    const pct = point.validos ? point.y / point.validos : 0;

                    return `
                        <div style="min-width: 200px;">
                            <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: ${
                                themeColors.text
                            }; border-bottom: 2px solid ${
                        this.color
                    }; padding-bottom: 6px;">
                                Pregunta ${point.casillero}
                            </div>
                            ${
                                point.texto
                                    ? `<div style="font-size: 12px; color: ${themeColors.dim}; margin-bottom: 10px; line-height: 1.4;">${point.texto}</div>`
                                    : ""
                            }
                            <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                <span style="display: inline-block; width: 12px; height: 12px; background: ${
                                    this.color
                                }; border-radius: 3px; margin-right: 8px;"></span>
                                <span style="font-weight: 600; color: ${
                                    themeColors.text
                                };">${this.series.name}:</span>
                            </div>
                            <div style="font-size: 20px; font-weight: 800; color: ${
                                this.color
                            }; margin-bottom: 4px;">
                                ${nf.format(point.y)}
                            </div>
                            <div style="font-size: 13px; font-weight: 600; color: ${
                                themeColors.dim
                            };">
                                ${pf.format(pct)} del total
                            </div>
                            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid ${
                                themeColors.border
                            }; font-size: 11px; color: ${themeColors.dim};">
                                Votos válidos: <span style="font-weight: 600;">${nf.format(
                                    point.validos
                                )}</span>
                            </div>
                        </div>
                    `;
                },
            },
            plotOptions: {
                series: {
                    stacking,
                    pointPadding: stacked ? 0.05 : 0.12,
                    groupPadding: 0.15,
                    borderRadius: 4,
                    borderWidth: 0,
                    cursor: "pointer",
                    shadow: false,
                    dataLabels: {
                        enabled: true,
                        inside: false,
                        align: "left",
                        style: {
                            fontSize: "13px",
                            fontWeight: "700",
                            textOutline: "none",
                            color: themeColors.text,
                        },
                        formatter: function () {
                            const row = sorted[this.point.index];
                            const pct = row.validos ? this.y / row.validos : 0;
                            return `<span style="font-weight: 800;">${nf.format(
                                this.y
                            )}</span> <span style="font-weight: 600; opacity: 0.7;">(${pf.format(
                                pct
                            )})</span>`;
                        },
                    },
                    states: {
                        inactive: {
                            opacity: 0.3,
                        },
                        hover: {
                            brightness: 0.09,
                            shadow: false,
                            borderWidth: 0,
                        },
                    },
                },
            },
            series,
            credits: { enabled: false },
            exporting: { enabled: false },
        }),
        [categories, stacked, stacking, series, sorted, themeColors, isDark]
    );

    /* Loading */
    if (loading) {
        return (
            <Box>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="md">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Paper
                            key={i}
                            withBorder
                            radius="sm"
                            p="sm"
                            style={{ height: 120 }}
                        >
                            <Box
                                style={{
                                    background: themeColors.grid,
                                    height: 14,
                                    width: "55%",
                                    borderRadius: 4,
                                    marginBottom: 10,
                                }}
                            />
                            <Box
                                style={{
                                    background: themeColors.grid,
                                    height: 28,
                                    width: "40%",
                                    borderRadius: 4,
                                }}
                            />
                        </Paper>
                    ))}
                </SimpleGrid>
                <Paper withBorder radius="sm" p="sm" style={{ height: 460 }} />
            </Box>
        );
    }

    if (!loadingResultados || sorted.length === 0) {
        return (
            <Paper withBorder radius="sm" p="xl" ta="center" mt={20}>
                <Text fw={600} fz="lg">
                    Sin datos
                </Text>
                <Text c="dimmed" fz="sm">
                    Aplica filtros y vuelve a cargar los resultados.
                </Text>
            </Paper>
        );
    }

    return (
        <Box mt={20} mb={20}>
            {/* KPIs Mejorados */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
                <KPIWithProgress
                    label="Total de Huellas/Firmas"
                    current={totalValidos}
                    total={totalElectores}
                    color={theme.colors.blue[6]}
                />

                <KPI
                    label="Votos en Blanco"
                    value={nf.format(totalBlancos)}
                    subtitle={pf.format(pctBlancos)}
                    color={COLORS.blancos}
                />

                <KPI
                    label="Votos Nulos"
                    value={nf.format(totalNulos)}
                    subtitle={pf.format(pctNulos)}
                    color={COLORS.nulos}
                />

                <KPI
                    label="Total Electores"
                    value={nf.format(totalElectores)}
                    subtitle="Padrón Electoral"
                    color={theme.colors.violet[6]}
                />
            </SimpleGrid>

            {/* Controles */}
            <Group justify="space-between" mb="md" wrap="wrap">
                <Group gap="sm">
                    <Switch
                        checked={stacked}
                        onChange={(e) => setStacked(e.currentTarget.checked)}
                        label="Apilar"
                        size="md"
                    />
                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        data={[
                            { value: "casillero", label: "Casillero" },
                            { value: "si", label: "Votos SI" },
                            { value: "no", label: "Votos NO" },
                            { value: "ruido", label: "Ruido (B+N)" },
                            { value: "p_si", label: "% SI" },
                        ]}
                        w={190}
                        allowDeselect={false}
                        placeholder="Orden"
                    />
                </Group>
            </Group>

            {/* Gráfico principal */}
            <Paper withBorder radius="sm" p="sm" shadow="sm">
                <div style={{ width: "100%", height: 480 }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={barOptions}
                    />
                </div>
            </Paper>
        </Box>
    );
};
