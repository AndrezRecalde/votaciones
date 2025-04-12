import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from 'react-chartjs-2'
import { useResultadoStore } from '../../hooks';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Card } from "@mantine/core";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const ChartResultado = () => {

    const { resultadoCandidatos } = useResultadoStore();

    const labels = resultadoCandidatos?.map(
        (candidato) => candidato.nombre_candidato
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Total de Votos: ",
                data: resultadoCandidatos?.map(
                    (candidato) => candidato.total_votos
                ),
                backgroundColor: resultadoCandidatos?.map(
                    (candidato) => candidato.color
                ),
                borderColor: resultadoCandidatos?.map(
                    (candidato) => candidato.color
                ),
                borderWidth: 2,
                borderRadius: 2,
                plugins: [ChartDataLabels],
                datalabels: {
                    color: "#000",  // Color blanco para un contraste limpio
                    align: "center",  // Colocar las etiquetas en la parte superior para mayor claridad
                    font: {
                        weight: "bold",  // Negrita para resaltar el texto
                        style: "italic",  // Cursiva para darle un toque elegante
                        size: 17,  // Tamaño moderado para mantener la simplicidad
                    },
                    padding: 2,  // Reducir el espacio entre la etiqueta y la barra para una apariencia más compacta
                    formatter: (value) => {
                        return `${value.toLocaleString()}`;  // Formatear el número para presentación limpia
                    },
                    labels: {
                        title: {
                            font: {
                                weight: "bold",  // Mantener el título en negrita
                                style: "italic",  // Cursiva para el título también
                                size: 16,  // Tamaño un poco mayor para el título
                            },
                            color: "#000",  // Asegurar que el color del título también sea blanco
                        },
                    },
                }
            },
        ],
    };

    const options = {
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        scales: {
            y: {
                ticks: {
                    font: {
                        size: 14,
                        weight: "italic",
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: "top",
                onClick: (event, legendItem, legend) => {
                    const index = legend.chart.data.labels.indexOf(
                        legendItem.text
                    );
                    legend.chart.toggleDataVisibility(index);
                    legend.chart.getDataVisibility(index);
                    legend.chart.update();
                },
                labels: {
                    font: {
                        size: 14,
                        weight: "italic",
                    },
                    generateLabels: (chart) => {
                        let visibility = [];
                        for (let i = 0; i < chart.data.labels?.length; i++) {
                            if (chart.getDataVisibility(i) === true) {
                                visibility.push(false);
                            } else {
                                visibility.push(true);
                            }
                        }
                        return chart.data.labels?.map((label, index) => ({
                            text: label,
                            fontColor: "gray",
                            strokeStyle:
                                chart.data.datasets[0].borderColor[index],
                            fillStyle:
                                chart.data.datasets[0].backgroundColor[index],
                            hidden: visibility[index],
                        }));
                    },
                },
            },
            title: {
                display: true,
                text: `GRAFICO DE RESULTADOS - ${resultadoCandidatos[1]?.nombre_dignidad}`,
                font: {
                    size: 20,
                    style: "italic",
                    weight: "bold",
                },
            },
        },
    };

    return (
        <Card mb={20} withBorder shadow="sm" radius="md">
            <Bar options={options} data={data} />
        </Card>
    );
};
