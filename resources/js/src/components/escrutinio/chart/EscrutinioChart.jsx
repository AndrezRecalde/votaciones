import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEscrutinioStore } from "../../../hooks";

/**
 * Props:
 *  - baseHeight: altura mínima del chart
 *  - rowFactor: píxeles adicionales por categoría
 *  - maxHeight: altura máxima para no exceder demasiado
 */
export const EscrutinioChart = () => {
    const { resultadosEscrutinio } = useEscrutinioStore();

    // Configuración de dignidades (orden y colores sobrios)
    const dignidadesConfig = [
        {
            key: "PRESIDENTES Y VICEPRESIDENTES",
            label: "Presidentes y Vicepresidentes",
            color: "#0f089e",
        },
        /* {
      key: "ASAMBLEISTAS NACIONALES",
      label: "Asambleístas Nacionales",
      color: "#8F6FFF",
    },
    {
      key: "ASAMBLEISTAS PROVINCIALES",
      label: "Asambleístas Provinciales",
      color: "#32B28A",
    }, */
    ];

    const { categories, series } = useMemo(() => {
        // Orden de aparición único de cantones
        const cantonOrder = [];
        const seen = new Set();
        for (const it of resultadosEscrutinio || []) {
            const c = it?.nombre_canton;
            if (c && !seen.has(c)) {
                seen.add(c);
                cantonOrder.push(c);
            }
        }

        // Preparar arrays vacíos por dignidad
        const seriesMap = new Map(
            dignidadesConfig.map((d) => [
                d.key,
                Array(cantonOrder.length).fill(0),
            ])
        );

        // Rellenar
        for (const it of resultadosEscrutinio || []) {
            const canton = it?.nombre_canton;
            const dignidad = it?.nombre_dignidad;
            const ingresadas = Number(it?.ingresadas || 0);
            if (!canton || !seriesMap.has(dignidad)) continue;
            const idx = cantonOrder.indexOf(canton);
            if (idx >= 0) {
                seriesMap.get(dignidad)[idx] = ingresadas;
            }
        }

        const series = dignidadesConfig.map((d) => ({
            type: "column",
            name: d.label,
            data: seriesMap.get(d.key) || [],
            color: d.color,
        }));

        return { categories: cantonOrder, series };
    }, [resultadosEscrutinio]);

    // Para evitar que el ancho achique demasiado las barras si hay muchas categorías
    const seriesCount = dignidadesConfig.length;
    const minWidth = Math.max(720, categories.length * (seriesCount * 26 + 60));

    const options = useMemo(() => {
        return {
            chart: {
                type: "column",
                backgroundColor: "transparent",
                height: Math.max(500, (categories?.length || 0) * 40),
                spacing: [16, 16, 16, 16],
                animation: { duration: 450 },
                scrollablePlotArea: {
                    minWidth,
                    scrollPositionX: 0,
                },
            },
            title: {
                text: "Ingresadas por dignidad y cantón",
                style: {
                    color: "#27323B",
                    fontWeight: 600,
                    fontSize: "18px",
                },
                margin: 18,
            },
            xAxis: {
                categories,
                lineColor: "rgba(39,50,59,0.18)",
                tickWidth: 0,
                labels: {
                    rotation: -35,
                    style: {
                        color: "#4A5661",
                        fontSize: "12px",
                        fontWeight: 500,
                        textOverflow: "ellipsis",
                        maxWidth: "140px",
                    },
                },
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                gridLineColor: "rgba(39,50,59,0.18)",
                gridLineDashStyle: "ShortDash",
                title: {
                    text: "Actas ingresadas",
                    style: { color: "#6C7883", fontSize: "12px" },
                },
                labels: { style: { color: "#4A5661" } },
            },
            legend: {
                itemStyle: { color: "#4A5661", fontWeight: 500 },
                itemHoverStyle: { color: "#27323B" },
                backgroundColor: "transparent",
                align: "center",
                verticalAlign: "bottom",
                symbolRadius: 4,
            },
            tooltip: {
                shared: true,
                useHTML: true,
                backgroundColor: "#1F262C",
                borderColor: "#2D3740",
                borderRadius: 10,
                style: { color: "#E6EBEF", fontSize: "12px" },
                formatter: function () {
                    const total = (this.points || []).reduce(
                        (sum, p) => sum + (Number(p.y) || 0),
                        0
                    );
                    let s = `<div style="padding:4px 2px">
            <div style="font-size:13px;font-weight:600;margin-bottom:4px">${this.x}</div>`;
                    if (this.points) {
                        this.points.forEach((p) => {
                            s += `<div style="display:flex;align-items:center;gap:6px">
                <span style="color:${p.color};font-size:14px">●</span>
                <span style="color:#B7BEC3">${p.series.name}:</span>
                <strong style="color:#FFFFFF">${Highcharts.numberFormat(
                    p.y || 0,
                    0
                )}</strong>
              </div>`;
                        });
                    }
                    s += `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:6px 0" />
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#B7BEC3">Total</span>
                  <strong style="color:#46C2CB">${Highcharts.numberFormat(
                      total,
                      0
                  )}</strong>
                </div></div>`;
                    return s;
                },
            },
            plotOptions: {
                series: {
                    grouping: true,
                    groupPadding: 0.18,
                    pointPadding: 0.08,
                    borderWidth: 0,
                    maxPointWidth: 46,
                    dataLabels: {
                        enabled: true,
                        style: {
                            textOutline: "none",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#22323A",
                        },
                        formatter: function () {
                            const val = Number(this.y) || 0;
                            if (val <= 0) return null;
                            return Highcharts.numberFormat(val, 0);
                        },
                    },
                    states: {
                        hover: { enabled: true, brightness: 0.08 },
                        inactive: { opacity: 0.35 },
                    },
                },
                column: {
                    borderRadius: 6,
                },
            },
            series,
            credits: { enabled: false },
            exporting: { enabled: false },
            accessibility: {
                enabled: true,
                point: { valueSuffix: " actas" },
            },
            responsive: {
                rules: [
                    {
                        condition: { maxWidth: 640 },
                        chartOptions: {
                            chart: { spacing: [10, 10, 10, 10] },
                            xAxis: {
                                labels: {
                                    style: { fontSize: "10px" },
                                    rotation: -30,
                                },
                            },
                            legend: { itemStyle: { fontSize: "11px" } },
                        },
                    },
                ],
            },
        };
    }, [categories, series, minWidth]);

    return (
        <div style={{ width: "100%", background: "transparent", padding: 0 }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
