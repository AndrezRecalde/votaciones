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
                    color: "black",
                    align: "bottom",
                    labels: {
                        title: {
                            font: {
                                weight: "italic",
                                size: 16,
                            },
                        },
                    },
                },
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
                        size: 15, //this change the font size
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
                            fontColor: "grey",
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
                text: `Gráfico de Resultados ${resultadoCandidatos[1]?.nombre_dignidad}`,
                font: {
                    size: 20,
                    weight: "bold",
                },
            },
        },
    };

  return (
    <Bar options={options} data={data} />
  )
}
