import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useResultadoStore } from "../../hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

export const EscrutinioParcial = () => {
    // Desestructuración de datos desde el hook
    const { totalActasIngresadas, totalJuntas } = useResultadoStore();

    // Validar datos para evitar errores si son undefined o nulos
    const digitadas = totalActasIngresadas?.digitadas || 0;
    const totalJuntasCount = totalJuntas?.total || 0;

    // Calcular datos una sola vez
    const restantes = totalJuntasCount - digitadas;

    // Definir la configuración del gráfico
    const data = {
        labels: ["Ingresadas", "Restantes"],
        datasets: [
            {
                label: "Total",
                data: [digitadas, restantes],
                backgroundColor: [
                    "rgba(73, 81, 239, 0.8)",
                    "rgba(255, 99, 132, 0.5)",
                ],
                borderColor: ["rgba(8, 20, 230, 0.8)", "rgba(255, 99, 132, 1)"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw}`,
                },
            },
        },
    };

    return <Pie data={data} options={options} width={230} height={200} />;
};
