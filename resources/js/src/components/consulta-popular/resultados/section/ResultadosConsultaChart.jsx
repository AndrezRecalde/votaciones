import React, { useCallback, useMemo, useState } from "react";
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
    Tooltip as MantineTooltip,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useResultadoConsultaStore } from "../../../../hooks";

/* ===================== PALETA (colores sólidos) ===================== */
const COLORS = {
    si: "#339af0", // azul
    no: "#ff6b6b", // rojo
    blancos: "#20c997", // turquesa
    nulos: "#ffd43b", // amarillo
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

/* ===================== SUBCOMPONENTES UI ===================== */
function KPI({ label, value }) {
    return (
        <Paper
            withBorder
            radius="md"
            p="md"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minHeight: 90,
            }}
        >
            <Text
                size="xs"
                fw={600}
                c="dimmed"
                style={{ letterSpacing: 0.8, fontFamily: "Inter, sans-serif" }}
            >
                {label.toUpperCase()}
            </Text>
            <Text
                fw={800}
                fz="xl"
                style={{
                    lineHeight: 1.1,
                    fontFamily: "Inter, sans-serif",
                }}
            >
                {value}
            </Text>
        </Paper>
    );
}

function MiniStat({ label, value, percent, color }) {
    const theme = useMantineTheme();

    return (
        <Paper
            withBorder
            radius="md"
            p="sm"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 120,
            }}
        >
            <Text size="xs" c="dimmed" fw={500} style={{ letterSpacing: 0.4 }}>
                {label}
            </Text>
            <Group gap={6} align="baseline">
                <Text
                    fw={700}
                    fz="lg"
                    style={{
                        color: color,
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    {value}
                </Text>
                {percent != null && (
                    <Badge
                        variant="light"
                        size="xs"
                        style={{
                            fontWeight: 500,
                        }}
                    >
                        {pf.format(percent)}
                    </Badge>
                )}
            </Group>
            <Box
                style={{
                    position: "relative",
                    height: 6,
                    borderRadius: 4,
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[5]
                            : theme.colors.gray[2],
                    overflow: "hidden",
                }}
            >
                <Box
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${(percent || 0) * 100}%`,
                        background: color,
                        transition: "width 180ms ease",
                    }}
                />
            </Box>
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
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Colores adaptados al theme de Mantine
    const themeColors = useMemo(
        () => ({
            grid: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
            border: isDark ? theme.colors.dark[4] : theme.colors.gray[4],
            panel: isDark ? theme.colors.dark[7] : theme.white,
            panelAlt: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
            text: isDark ? theme.colors.dark[0] : theme.black,
            dim: isDark ? theme.colors.dark[2] : theme.colors.gray[6],
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
    const participacion =
        totalElectores > 0 ? totalValidos / totalElectores : 0;
    const ruidoGlobal =
        totalValidos > 0 ? (totalBlancos + totalNulos) / totalValidos : 0;

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

    /* Series generadora (horizontal bar) - COLORES SÓLIDOS */
    const makeSeries = (key, percentKey, name, color) => ({
        name,
        color: color,
        data: sorted.map((r, idx) => ({
            y: r[key],
            abs: r[key],
            percent: r[percentKey],
            validos: r.validos,
            texto: r.texto,
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

    /* Tooltip */
    const tooltipFormatter = function () {
        const idx = this.points?.[0]?.point?.index ?? 0;
        const row = sorted[idx];
        const header =
            `<div style="margin-bottom:4px;font-weight:600;font-size:12px;color:${themeColors.text}">Pregunta ${row.casillero}</div>` +
            (row.texto
                ? `<div style="max-width:360px;font-size:11px;color:${themeColors.dim};margin-bottom:6px;line-height:1.35;">${row.texto}</div>`
                : "");
        const body = (this.points || [])
            .map((p) => {
                const pct = row.validos ? p.y / row.validos : 0;
                return `<div style="margin-bottom:2px;"><span style="display:inline-block;width:10px;height:10px;background:${
                    p.color
                };border-radius:2px;margin-right:6px;"></span>${
                    p.series.name
                }: <b>${nf.format(p.y)}</b> <span style="color:${
                    themeColors.dim
                }">(${pf.format(pct)})</span></div>`;
            })
            .join("");
        const footer = row.validos
            ? `<div style="margin-top:6px;font-size:11px;color:${
                  themeColors.dim
              };">Válidos: <b>${nf.format(row.validos)}</b></div>`
            : "";
        return `<div style="color:${themeColors.text}">${header}${body}${footer}</div>`;
    };

    /* Opciones gráfico barras horizontales (bar) */
    const barOptions = useMemo(
        () => ({
            chart: {
                type: "bar",
                height: 480,
                backgroundColor: "transparent",
                style: { fontFamily: "Inter, sans-serif" },
                spacingTop: 20,
                spacingBottom: 12,
            },
            title: { text: undefined },
            xAxis: {
                categories,
                gridLineColor: themeColors.grid,
                lineColor: themeColors.border,
                tickColor: themeColors.border,
                labels: { style: { color: themeColors.dim, fontSize: "12px" } },
            },
            yAxis: {
                min: 0,
                gridLineColor: themeColors.grid,
                title: {
                    text: "Votos",
                    style: { color: themeColors.dim, fontSize: "12px" },
                },
                labels: {
                    style: { color: themeColors.dim },
                    formatter: function () {
                        return nf.format(this.value);
                    },
                },
            },
            legend: {
                itemStyle: { color: themeColors.text, fontWeight: 500 },
                itemHoverStyle: { color: isDark ? "#ffffff" : "#000000" },
                symbolRadius: 3,
                backgroundColor: themeColors.panelAlt,
                borderColor: themeColors.border,
                borderWidth: 1.5,
                padding: 8,
            },
            tooltip: {
                shared: true,
                useHTML: true,
                borderColor: themeColors.border,
                backgroundColor: themeColors.panelAlt,
                style: { color: themeColors.text },
                borderRadius: 10,
                formatter: tooltipFormatter,
            },
            plotOptions: {
                series: {
                    stacking,
                    pointPadding: stacked ? 0.05 : 0.15,
                    groupPadding: 0.1,
                    borderRadius: 5,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        inside: false,
                        style: {
                            fontSize: "11px",
                            fontWeight: 600,
                            textOutline: "none",
                            color: themeColors.text,
                        },
                        formatter: function () {
                            const row = sorted[this.point.index];
                            const pct = row.validos ? this.y / row.validos : 0;
                            return `${nf.format(this.y)} (${pf.format(pct)})`;
                        },
                    },
                    states: {
                        inactive: { opacity: 0.3 },
                        hover: { brightness: 0.05 },
                    },
                    point: {
                        events: {
                            click: function () {
                                setSelectedIndex(this.index);
                            },
                        },
                    },
                },
                bar: {
                    borderWidth: 1.2,
                },
            },
            series,
            credits: { enabled: false },
            exporting: {
                enabled: false,
            },
        }),
        [categories, stacked, stacking, series, sorted, themeColors, isDark]
    );

    /* Seleccionado */
    const selected = selectedIndex != null ? sorted[selectedIndex] : null;

    /* Donut */
    const pieOptions = useMemo(() => {
        if (!selected) return null;
        const data = [
            { name: "SI", y: selected.si, color: COLORS.si },
            { name: "NO", y: selected.no, color: COLORS.no },
            { name: "Blancos", y: selected.blancos, color: COLORS.blancos },
            { name: "Nulos", y: selected.nulos, color: COLORS.nulos },
        ];

        return {
            chart: {
                type: "pie",
                height: 300,
                backgroundColor: "transparent",
            },
            title: {
                text: `Pregunta ${selected.casillero}`,
                align: "center",
                style: {
                    color: themeColors.text,
                    fontSize: "14px",
                    fontWeight: 600,
                },
            },
            tooltip: {
                pointFormatter: function () {
                    const pct = selected.validos
                        ? this.y / selected.validos
                        : 0;
                    return `<span style="color:${this.color}">\u25CF</span> ${
                        this.name
                    }: <b>${nf.format(this.y)}</b> <span style="color:${
                        themeColors.dim
                    }">(${pf.format(pct)})</span><br/>`;
                },
                borderColor: themeColors.border,
                backgroundColor: themeColors.panelAlt,
                style: { color: themeColors.text },
                borderRadius: 10,
            },
            plotOptions: {
                pie: {
                    innerSize: "62%",
                    borderColor: themeColors.panelAlt,
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 600,
                            fontSize: "11px",
                            textOutline: "none",
                            color: themeColors.text,
                        },
                        formatter: function () {
                            return nf.format(this.y);
                        },
                        distance: -28,
                    },
                    states: {
                        hover: { brightness: 0.06 },
                    },
                },
            },
            series: [{ name: "Detalle", data }],
            credits: { enabled: false },
            exporting: {
                enabled: false,
            },
        };
    }, [selected, themeColors]);

    /* Loading */
    if (loading) {
        return (
            <Box>
                <SimpleGrid cols={{ base: 2, sm: 4 }} mb="md">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Paper
                            key={i}
                            withBorder
                            radius="md"
                            p="md"
                            style={{ height: 90 }}
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
                <Paper withBorder radius="md" p="md" style={{ height: 460 }} />
            </Box>
        );
    }

    if (!loadingResultados || sorted.length === 0) {
        return (
            <Paper withBorder radius="md" p="xl" ta="center">
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
        <Box mt={20}>
            {/* KPIs */}
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="md">
                <KPI label="Electores" value={nf.format(totalElectores)} />
                <KPI label="Válidos" value={nf.format(totalValidos)} />
                <KPI label="Participación" value={pf.format(participacion)} />
                <KPI label="Ruido (B+N)" value={pf.format(ruidoGlobal)} />
            </SimpleGrid>

            {/* Controles */}
            <Group justify="space-between" mb="sm" wrap="wrap">
                <Group gap="sm">
                    <Switch
                        checked={stacked}
                        onChange={(e) => setStacked(e.currentTarget.checked)}
                        label="Apilar"
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
                <Group gap={6}>
                    <Badge color="blue" variant="dot">
                        SI
                    </Badge>
                    <Badge color="red" variant="dot">
                        NO
                    </Badge>
                    <Badge color="teal" variant="dot">
                        Blancos
                    </Badge>
                    <Badge color="yellow" variant="dot">
                        Nulos
                    </Badge>
                </Group>
            </Group>

            {/* Gráfico principal */}
            <Paper withBorder radius="md" p="md">
                <div style={{ width: "100%", height: 480 }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={barOptions}
                    />
                </div>

                <Divider my="md" style={{ opacity: 0.6 }} />

                <Group align="flex-start" wrap="wrap">
                    {/* Panel detalle */}
                    <Box style={{ flex: 1, minWidth: 320 }}>
                        {selected ? (
                            <Paper
                                withBorder
                                radius="md"
                                p="md"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                }}
                            >
                                <Group justify="space-between" mb={-4}>
                                    <Text fw={700} fz="sm">
                                        Pregunta {selected.casillero}
                                    </Text>
                                    <Badge variant="light" color="gray">
                                        Válidos: {nf.format(selected.validos)}
                                    </Badge>
                                </Group>
                                {selected.texto && (
                                    <MantineTooltip
                                        label={selected.texto}
                                        multiline
                                        position="top-start"
                                    >
                                        <Text
                                            c="dimmed"
                                            size="xs"
                                            lineClamp={3}
                                            mb="xs"
                                        >
                                            {selected.texto}
                                        </Text>
                                    </MantineTooltip>
                                )}
                                <SimpleGrid
                                    cols={{ base: 2, sm: 2 }}
                                    spacing="md"
                                >
                                    <MiniStat
                                        label="SI"
                                        color={COLORS.si}
                                        value={nf.format(selected.si)}
                                        percent={selected.p_si}
                                    />
                                    <MiniStat
                                        label="NO"
                                        color={COLORS.no}
                                        value={nf.format(selected.no)}
                                        percent={selected.p_no}
                                    />
                                    <MiniStat
                                        label="Blancos"
                                        color={COLORS.blancos}
                                        value={nf.format(selected.blancos)}
                                        percent={selected.p_blancos}
                                    />
                                    <MiniStat
                                        label="Nulos"
                                        color={COLORS.nulos}
                                        value={nf.format(selected.nulos)}
                                        percent={selected.p_nulos}
                                    />
                                </SimpleGrid>
                            </Paper>
                        ) : (
                            <Text c="dimmed" size="xs">
                                Haz clic en una barra para ver el detalle de la
                                pregunta.
                            </Text>
                        )}
                    </Box>

                    {/* Donut */}
                    {pieOptions && (
                        <Paper
                            withBorder
                            radius="md"
                            p="sm"
                            style={{
                                width: 340,
                                position: "relative",
                            }}
                        >
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={pieOptions}
                            />
                            {selected && (
                                <Box
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%,-50%)",
                                        textAlign: "center",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <Text fw={700} size="sm">
                                        Totales
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        Válidos {nf.format(selected.validos)}
                                    </Text>
                                </Box>
                            )}
                        </Paper>
                    )}
                </Group>
            </Paper>
        </Box>
    );
};
