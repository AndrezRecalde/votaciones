import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useResultadoStore } from "../../hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

export const EscrutinioParcial = () => {
    const { totalActasIngresadas, totalJuntas } = useResultadoStore();

    const digitadas = totalActasIngresadas?.digitadas || 0;
    const totalJuntasCount = totalJuntas?.total || 0;

    const restantes = totalJuntasCount - digitadas;

    const data = {
        labels: ["Ingresadas", "Restantes"],
        datasets: [
            {
                label: "Total",
                data: [digitadas, restantes],
                backgroundColor: [
                    "rgba(100, 120, 255, 0.7)",  // Azul más suave
                    "rgba(255, 99, 132, 0.6)",  // Rojo más suave
                ],
                borderColor: ["rgba(8, 20, 230, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 2,
                borderRadius: 8,  // Bordes redondeados para un estilo más suave
                hoverBorderColor: ["rgba(8, 20, 230, 0.6)", "rgba(255, 99, 132, 0.8)"], // Efecto de hover sutil
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    font: {
                        family: "Arial, sans-serif",
                        size: 14,
                        weight: "bold",
                    },
                    color: "rgba(0, 0, 0, 0.7)",  // Color sutil para la leyenda
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",  // Fondo del tooltip oscuro con transparencia
                titleFont: {
                    size: 14,
                    weight: "bold",
                    family: "Arial, sans-serif",
                },
                bodyFont: {
                    size: 12,
                    family: "Arial, sans-serif",
                },
                callbacks: {
                    label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}`,  // Formatear números
                },
            },
        },
    };

    return <Pie data={data} options={options} width={230} height={200} />;
};
