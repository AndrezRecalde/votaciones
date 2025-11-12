import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMantineColorScheme } from "@mantine/core";
import { useTendenciaConsultaStore } from "../../../../hooks";

export const SeguimientoConsultaJuntasChart = () => {
    const { tendenciasConsulta } = useTendenciaConsultaStore();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    const chartOptions = useMemo(() => {
        // Extraer los nombres de las juntas para el eje X
        const categories = tendenciasConsulta.map((item) => item.junta_nombre);

        // Extraer los votos SÍ y NO para las series con metadata adicional
        const votosSi = tendenciasConsulta.map((item) => ({
            y: item.votos_si,
            nombre_recinto: item.nombre_recinto,
            junta_nombre: item.junta_nombre,
        }));

        const votosNo = tendenciasConsulta.map((item) => ({
            y: item.votos_no,
            nombre_recinto: item.nombre_recinto,
            junta_nombre: item.junta_nombre,
        }));

        // Obtener el texto de la pregunta (asumiendo que es la misma para todos)
        const textoPregunta = tendenciasConsulta[0]?.texto_pregunta || "";

        // Colores según el tema
        const bgColor = isDark ? "transparent" : "transparent";
        const textColor = isDark ? "#e8e8e8" : "#1a1a1a";
        const gridColor = isDark ? "#2d2d44" : "#e0e0e0";
        const subtitleColor = isDark ? "#a0a0b0" : "#666666";

        return {
            chart: {
                type: "line",
                height: 450,
                backgroundColor: bgColor,
                style: {
                    fontFamily:
                        "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                },
                plotBorderColor: gridColor,
                plotBorderWidth: 0,
                spacing: [20, 20, 20, 20],
            },
            title: {
                text: "Tendencia de Votos por Junta",
                style: {
                    fontSize: "22px",
                    fontWeight: "700",
                    color: textColor,
                    letterSpacing: "0.5px",
                },
                margin: 25,
            },
            subtitle: {
                text: textoPregunta,
                style: {
                    fontSize: "14px",
                    color: subtitleColor,
                    fontWeight: "400",
                    fontStyle: "italic",
                },
                margin: 20,
            },
            xAxis: {
                categories: categories,
                title: {
                    text: "Juntas Electorales",
                    style: {
                        color: subtitleColor,
                        fontSize: "14px",
                        fontWeight: "600",
                    },
                    margin: 15,
                },
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: "12px",
                        color: textColor,
                        fontWeight: "500",
                    },
                },
                gridLineColor: gridColor,
                lineColor: gridColor,
                tickColor: gridColor,
                crosshair: {
                    width: 1,
                    color: isDark ? "#4a4a6a" : "#d0d0d0",
                    dashStyle: "Dash",
                },
            },
            yAxis: {
                title: {
                    text: "Cantidad de Votos",
                    style: {
                        color: subtitleColor,
                        fontSize: "14px",
                        fontWeight: "600",
                    },
                },
                labels: {
                    style: {
                        color: textColor,
                        fontSize: "12px",
                    },
                    formatter: function () {
                        return this.value.toLocaleString();
                    },
                },
                min: 0,
                gridLineColor: gridColor,
                gridLineDashStyle: "Dot",
            },
            tooltip: {
                shared: true,
                useHTML: true,
                backgroundColor: isDark
                    ? "rgba(20, 20, 35, 0.98)"
                    : "rgba(255, 255, 255, 0.98)",
                borderColor: isDark ? "#3d3d5c" : "#cccccc",
                borderRadius: 12,
                borderWidth: 2,
                padding: 16,
                style: {
                    color: textColor,
                    fontSize: "13px",
                },
                shadow: {
                    color: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)",
                    offsetX: 0,
                    offsetY: 4,
                    opacity: 0.3,
                    width: 8,
                },
                formatter: function () {
                    const points = this.points;

                    // Obtener los valores de los puntos y metadata
                    let votosSiVal = 0;
                    let votosNoVal = 0;
                    let nombreRecinto = "";
                    let juntaNombre = this.x;

                    points.forEach((point) => {
                        if (point.series.name === "Votos SÍ") {
                            votosSiVal = point.y;
                            nombreRecinto = point.point.nombre_recinto || "N/A";
                        } else if (point.series.name === "Votos NO") {
                            votosNoVal = point.y;
                            if (!nombreRecinto) {
                                nombreRecinto =
                                    point.point.nombre_recinto || "N/A";
                            }
                        }
                    });

                    const totalVotos = votosSiVal + votosNoVal;
                    const pctSi =
                        totalVotos > 0
                            ? ((votosSiVal / totalVotos) * 100).toFixed(1)
                            : "0.0";
                    const pctNo =
                        totalVotos > 0
                            ? ((votosNoVal / totalVotos) * 100).toFixed(1)
                            : "0.0";

                    let tooltipHTML = `
                        <div style="min-width: 240px;">
                            <div style="
                                font-size: 15px;
                                font-weight: 700;
                                margin-bottom: 8px;
                                padding-bottom: 8px;
                                border-bottom: 2px solid ${
                                    isDark ? "#3d3d5c" : "#e0e0e0"
                                };
                                color: ${textColor};
                            ">
                                ${juntaNombre}
                            </div>

                            <div style="
                                font-size: 12px;
                                color: ${subtitleColor};
                                margin-bottom: 12px;
                                font-weight: 500;
                            ">
                                📍 ${nombreRecinto}
                            </div>

                            <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center;">
                                    <span style="
                                        color: #10b981;
                                        font-size: 18px;
                                        margin-right: 8px;
                                        font-weight: bold;
                                    ">●</span>
                                    <span style="font-weight: 600;">Votos SÍ:</span>
                                </div>
                                <div>
                                    <span style="font-weight: 700; font-size: 14px;">${votosSiVal.toLocaleString()}</span>
                                    <span style="
                                        color: #10b981;
                                        font-weight: 600;
                                        margin-left: 6px;
                                        background: ${
                                            isDark
                                                ? "rgba(16, 185, 129, 0.15)"
                                                : "rgba(16, 185, 129, 0.1)"
                                        };
                                        padding: 2px 6px;
                                        border-radius: 4px;
                                        font-size: 12px;
                                    ">${pctSi}%</span>
                                </div>
                            </div>

                            <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center;">
                                    <span style="
                                        color: #ef4444;
                                        font-size: 18px;
                                        margin-right: 8px;
                                        font-weight: bold;
                                    ">●</span>
                                    <span style="font-weight: 600;">Votos NO:</span>
                                </div>
                                <div>
                                    <span style="font-weight: 700; font-size: 14px;">${votosNoVal.toLocaleString()}</span>
                                    <span style="
                                        color: #ef4444;
                                        font-weight: 600;
                                        margin-left: 6px;
                                        background: ${
                                            isDark
                                                ? "rgba(239, 68, 68, 0.15)"
                                                : "rgba(239, 68, 68, 0.1)"
                                        };
                                        padding: 2px 6px;
                                        border-radius: 4px;
                                        font-size: 12px;
                                    ">${pctNo}%</span>
                                </div>
                            </div>

                            <div style="
                                padding-top: 10px;
                                border-top: 1px solid ${
                                    isDark ? "#3d3d5c" : "#e0e0e0"
                                };
                                font-weight: 700;
                                font-size: 13px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            ">
                                <span>Total de Votos:</span>
                                <span style="
                                    font-size: 15px;
                                    color: ${isDark ? "#60a5fa" : "#2563eb"};
                                ">${totalVotos.toLocaleString()}</span>
                            </div>
                        </div>
                    `;

                    return tooltipHTML;
                },
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false,
                    },
                    enableMouseTracking: true,
                    marker: {
                        enabled: true,
                        radius: 6,
                        lineWidth: 2,
                        lineColor: isDark ? "#1a1a2e" : "#ffffff",
                    },
                    states: {
                        hover: {
                            lineWidthPlus: 2,
                            marker: {
                                radius: 8,
                                lineWidth: 3,
                            },
                        },
                        inactive: {
                            opacity: 0.4,
                        },
                    },
                    lineWidth: 3,
                },
                series: {
                    animation: {
                        duration: 1200,
                        easing: "easeOutQuart",
                    },
                    cursor: "pointer",
                },
            },
            series: [
                {
                    name: "Votos SÍ",
                    data: votosSi,
                    color: {
                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                        stops: [
                            [0, "#10b981"],
                            [1, "#059669"],
                        ],
                    },
                    lineWidth: 4,
                    marker: {
                        symbol: "circle",
                        fillColor: "#10b981",
                    },
                    dashStyle: "Solid",
                },
                {
                    name: "Votos NO",
                    data: votosNo,
                    color: {
                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                        stops: [
                            [0, "#ef4444"],
                            [1, "#dc2626"],
                        ],
                    },
                    lineWidth: 4,
                    marker: {
                        symbol: "circle",
                        fillColor: "#ef4444",
                    },
                    dashStyle: "Solid",
                },
            ],
            legend: {
                align: "center",
                verticalAlign: "bottom",
                layout: "horizontal",
                itemStyle: {
                    color: textColor,
                    fontSize: "14px",
                    fontWeight: "600",
                },
                itemHoverStyle: {
                    color: isDark ? "#ffffff" : "#000000",
                },
                itemHiddenStyle: {
                    color: isDark ? "#5a5a6a" : "#cccccc",
                },
                backgroundColor: "transparent",
                borderColor: gridColor,
                borderWidth: 1,
                borderRadius: 10,
                padding: 14,
                symbolRadius: 8,
                symbolHeight: 14,
                symbolWidth: 14,
                itemMarginBottom: 5,
            },
            credits: {
                enabled: false,
            },
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            chart: {
                                height: 400,
                            },
                            legend: {
                                align: "center",
                                verticalAlign: "bottom",
                                layout: "horizontal",
                            },
                            xAxis: {
                                labels: {
                                    rotation: -90,
                                    style: {
                                        fontSize: "10px",
                                    },
                                },
                            },
                            title: {
                                style: {
                                    fontSize: "18px",
                                },
                            },
                            subtitle: {
                                style: {
                                    fontSize: "12px",
                                },
                            },
                        },
                    },
                ],
            },
        };
    }, [tendenciasConsulta, isDark]);

    if (!tendenciasConsulta || tendenciasConsulta.length === 0) {
        return (
            <div className="w-full flex items-center justify-center p-8">
                <p className="text-gray-500">
                    No hay datos disponibles para mostrar
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};
