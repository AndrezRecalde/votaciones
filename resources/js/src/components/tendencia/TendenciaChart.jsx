import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { transformTendencias, useTendenciaStore } from "../../hooks";

export const TendenciaChart = () => {
    const { tendencias } = useTendenciaStore();

    // Transformar los datos para Highcharts
    const chartOptions = useMemo(() => {
        const { categories, series, recintoMap } =
            transformTendencias(tendencias);

        return {
            chart: {
                type: "line",
                backgroundColor: "transparent",
                height: 300,
                style: {
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                },
                spacingTop: 20,
                spacingBottom: 20,
            },
            title: {
                text: "",
                style: {
                    display: "none",
                },
            },
            credits: {
                enabled: false,
            },
            legend: {
                align: "center",
                verticalAlign: "top",
                layout: "horizontal",
                itemStyle: {
                    color: "#374151",
                    fontWeight: "500",
                    fontSize: "13px",
                },
                itemHoverStyle: {
                    color: "#111827",
                },
                itemMarginBottom: 10,
                symbolRadius: 6,
                symbolHeight: 12,
                symbolWidth: 12,
            },
            xAxis: {
                categories: categories,
                labels: {
                    style: {
                        color: "#6B7280",
                        fontSize: "12px",
                    },
                    rotation: -45,
                    align: "right",
                },
                lineColor: "#E5E7EB",
                tickColor: "#E5E7EB",
                gridLineWidth: 0,
            },
            yAxis: {
                title: {
                    text: "Votos",
                    style: {
                        color: "#6B7280",
                        fontSize: "13px",
                        fontWeight: "500",
                    },
                },
                labels: {
                    style: {
                        color: "#6B7280",
                        fontSize: "12px",
                    },
                },
                gridLineColor: "#F3F4F6",
                gridLineDashStyle: "Dash",
            },
            tooltip: {
                shared: true,
                crosshairs: {
                    width: 1,
                    color: "#D1D5DB",
                    dashStyle: "ShortDash",
                },
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                borderColor: "#E5E7EB",
                borderRadius: 10,
                borderWidth: 1,
                shadow: {
                    color: "rgba(0, 0, 0, 0.15)",
                    offsetX: 0,
                    offsetY: 4,
                    opacity: 0.15,
                    width: 6,
                },
                style: {
                    color: "#374151",
                    fontSize: "13px",
                },
                useHTML: true,
                formatter: function () {
                    const juntaIndex = this.points[0].point.index;
                    const juntaNombre = categories[juntaIndex];
                    const recintoNombre = recintoMap[juntaNombre] || "N/A";

                    let tooltip = `<div style="padding: 4px;">`;
                    tooltip += `<div style="font-weight: 600; margin-bottom: 4px; color: #111827; font-size: 14px;">${juntaNombre}</div>`;
                    tooltip += `<div style="color: #6B7280; margin-bottom: 8px; font-size: 12px; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB;">Recinto: ${recintoNombre}</div>`;

                    this.points.forEach((point) => {
                        tooltip += `<div style="display: flex; align-items: center; padding: 3px 0;">`;
                        tooltip += `<span style="color: ${point.color}; font-size: 18px; margin-right: 8px;">●</span>`;
                        tooltip += `<span style="margin-right: 8px; flex: 1;">${point.series.name}:</span>`;
                        tooltip += `<span style="font-weight: 600; color: #111827;">${point.y} votos</span>`;
                        tooltip += `</div>`;
                    });

                    tooltip += `</div>`;
                    return tooltip;
                },
            },
            plotOptions: {
                line: {
                    lineWidth: 3,
                    marker: {
                        radius: 5,
                        symbol: "circle",
                        lineWidth: 2,
                        lineColor: "#ffffff",
                        states: {
                            hover: {
                                radius: 7,
                                lineWidth: 2,
                            },
                        },
                    },
                    states: {
                        hover: {
                            lineWidth: 4,
                        },
                    },
                },
                series: {
                    animation: {
                        duration: 1000,
                    },
                },
            },
            series: series,
        };
    }, [tendencias]);

    return (
        <div
            style={{
                width: "100%",
                padding: "16px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            }}
        >
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};
