import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { useEscrutinioConsultaStore } from "../../../../hooks";

const PALETA = {
    // Sin fondos opacos: todo transparente para integrarse con tu layout
    chartBg: "transparent",
    textPrimario: "#27323B",
    textSecundario: "#4A5661",
    textSuave: "#6C7883",
    grid: "rgba(39,50,59,0.18)",
    avance: "#46C2CB",
    total: "rgba(120,140,156,0.35)",
    tooltipBg: "#20292F",
    tooltipBorder: "#2F3A42",
};

export const EscrutinioConsultaBarChart = () => {
    const { escrutinioConsulta } = useEscrutinioConsultaStore();
    const items = Array.isArray(escrutinioConsulta?.items)
        ? escrutinioConsulta.items
        : [];

    const { categories, totalJuntas, actasIngresadas, porcentajeAvance } =
        useMemo(() => {
            const cats = items.map((i) => i.canton);
            const total = items.map((i) => Number(i.total_juntas ?? 0));
            const actas = items.map((i) => Number(i.actas_ingresadas ?? 0));
            const pct = items.map((i) =>
                Number(
                    typeof i.porcentaje_avance === "string"
                        ? parseFloat(i.porcentaje_avance)
                        : i.porcentaje_avance || 0
                )
            );
            return {
                categories: cats,
                totalJuntas: total,
                actasIngresadas: actas,
                porcentajeAvance: pct,
            };
        }, [items]);

    const options = useMemo(() => {
        const pctByIndex = porcentajeAvance;

        return {
            chart: {
                type: "column",
                backgroundColor: PALETA.chartBg,
                //height: dynamicHeight, // Altura aplicada aquí
                height: Math.max(450, (categories?.length || 0) * 40),
                spacing: [10, 10, 8, 10],
                animation: { duration: 400 },
            },
            title: {
                text: "Avance de escrutinio por cantón",
                style: {
                    color: PALETA.textPrimario,
                    fontWeight: 600,
                    fontSize: "17px",
                },
                margin: 14,
            },
            xAxis: {
                categories,
                lineColor: PALETA.grid,
                tickWidth: 0,
                labels: {
                    style: {
                        color: PALETA.textSecundario,
                        fontSize: "12px",
                        fontWeight: 500,
                        textOverflow: "ellipsis",
                        maxWidth: "140px",
                    },
                    autoRotation: [0, -30, -45],
                },
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                gridLineColor: PALETA.grid,
                gridLineDashStyle: "ShortDash",
                title: {
                    text: "Juntas",
                    style: { color: PALETA.textSuave, fontSize: "12px" },
                },
                labels: { style: { color: PALETA.textSecundario } },
            },
            legend: {
                itemStyle: { color: PALETA.textSecundario, fontWeight: 500 },
                itemHoverStyle: { color: PALETA.textPrimario },
                backgroundColor: "transparent",
                align: "center",
                verticalAlign: "bottom",
                symbolRadius: 4,
            },
            tooltip: {
                shared: true,
                backgroundColor: PALETA.tooltipBg,
                borderColor: PALETA.tooltipBorder,
                borderRadius: 10,
                style: { color: "#E5EAEE", fontSize: "12px" },
                useHTML: true,
                formatter: function () {
                    const idx =
                        this.points?.[0]?.point?.index ??
                        this.point?.index ??
                        0;
                    const pct = pctByIndex[idx] ?? 0;
                    let s = `<div style="padding:4px 2px">
            <div style="font-size:13px;font-weight:600;margin-bottom:4px">${this.x}</div>`;
                    if (this.points) {
                        this.points.forEach((p) => {
                            s += `<div style="display:flex;align-items:center;gap:6px">
                <span style="color:${p.color};font-size:14px">●</span>
                <span style="color:#B7BEC3">${p.series.name}:</span>
                <strong style="color:#FFFFFF">${Highcharts.numberFormat(
                    p.y,
                    0
                )}</strong>
              </div>`;
                        });
                    }
                    s += `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:6px 0" />
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#B7BEC3">Avance</span>
                  <strong style="color:${
                      PALETA.avance
                  }">${Highcharts.numberFormat(pct, 2)}%</strong>
                </div></div>`;
                    return s;
                },
            },
            plotOptions: {
                series: {
                    animation: { duration: 450 },
                    // Buena separación entre categorías para que no se topen con las barras
                    groupPadding: 0.16,
                    pointPadding: 0.06,
                    borderWidth: 0,
                    maxPointWidth: 46,
                    dataLabels: {
                        enabled: true,
                        style: {
                            textOutline: "none",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#1F2937",
                        },
                        formatter: function () {
                            // Mostrar porcentaje solo si hay avance y la barra existe
                            if (this.series.name === "Actas ingresadas") {
                                const idx = this.point.index ?? 0;
                                const pct = pctByIndex[idx] ?? 0;
                                if ((this.y || 0) > 0 && pct > 0) {
                                    return `${Highcharts.numberFormat(
                                        pct,
                                        1
                                    )}%`;
                                }
                            }
                            return null;
                        },
                    },
                    states: {
                        hover: { brightness: 0.08 },
                        inactive: { opacity: 0.35 },
                    },
                },
                column: {
                    borderRadius: 5,
                    // columnas lado a lado (comparación directa)
                    // si prefieres, puedes reducir más el pointPadding para barras más anchas
                },
            },
            series: [
                {
                    type: "column",
                    name: "Total de juntas",
                    data: totalJuntas,
                    color: PALETA.total,
                    dataLabels: { enabled: false },
                    // Deja el total como referencia visual sobria
                    enableMouseTracking: true,
                },
                {
                    type: "column",
                    name: "Actas ingresadas",
                    data: actasIngresadas,
                    color: PALETA.avance,
                    zIndex: 5,
                },
            ],
            credits: { enabled: false },
            exporting: { enabled: false },
            accessibility: {
                enabled: true,
                point: { valueSuffix: " juntas" },
            },
            responsive: {
                rules: [
                    {
                        condition: { maxWidth: 640 },
                        chartOptions: {
                            chart: { spacing: [8, 8, 6, 8] },
                            legend: { itemStyle: { fontSize: "11px" } },
                            xAxis: { labels: { style: { fontSize: "10px" } } },
                        },
                    },
                ],
            },
        };
    }, [categories, totalJuntas, actasIngresadas, porcentajeAvance]);

    return (
        <div
            style={{
                width: "100%",
                minHeight: 320,
                // Sin fondo ni borde para integrarse con tu layout
                background: "transparent",
                border: "none",
                padding: 0,
            }}
        >
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
