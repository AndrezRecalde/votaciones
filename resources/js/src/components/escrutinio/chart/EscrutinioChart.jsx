import { BarChart } from "@mantine/charts";
import { useEscrutinioStore } from "../../../hooks";


export const EscrutinioChart = () => {
    const { resultadosEscrutinio } = useEscrutinioStore();

    // Transformar datos dinámicamente
    const transformedData = resultadosEscrutinio.reduce((acc, item) => {
        // Verificar si ya existe el canton en la data acumulada
        const existingCanton = acc.find(
            (entry) => entry.province === item.nombre_canton
        );

        if (existingCanton) {
            // Agregar valores para la dignidad existente
            existingCanton[item.nombre_dignidad] = item.ingresadas;
        } else {
            // Crear un nuevo registro para el cantón
            acc.push({
                province: item.nombre_canton,
                [item.nombre_dignidad]: item.ingresadas,
            });
        }
        return acc;
    }, []);

    return (
        <BarChart
            h={500}
            data={transformedData} // Usar datos transformados
            withLegend
            barProps={{ radius: 5 }}
            dataKey="province"
            tickLine="y"
            gridAxis="xy"
            tooltipAnimationDuration={200}
            valueFormatter={(value) =>
                new Intl.NumberFormat("es-ES").format(value)
            }
            withBarValueLabel
            valueLabelProps={{ position: "inside", fill: "white" }}
            series={[
                {
                    label: "Presidentes y Vicepresidentes",
                    name: "PRESIDENTES Y VICEPRESIDENTES",
                    color: "red.5",
                },
                {
                    label: "Asambleistas Nacionales",
                    name: "ASAMBLEISTAS NACIONALES",
                    color: "indigo.5",
                },
                {
                    label: "Asambleistas Provinciales",
                    name: "ASAMBLEISTAS PROVINCIALES",
                    color: "teal.5",
                },
            ]}
            legendProps={{
                style: {
                    fontSize: "16px", // Tamaño de la fuente
                    fontFamily: "Poppins, sans-serif", // Fuente personalizada
                    color: "#333", // Color del texto
                },
            }}
            xAxisProps={{
                style: {
                    fontSize: "12px", // Tamaño de letra
                    fontFamily: "Poppins, sans-serif", // Fuente personalizada
                    fill: "#555", // Color del texto
                },
                angle: -45, // Rotación de las etiquetas en 45° hacia la izquierda
                dy: 15, // Ajuste vertical de las etiquetas (opcional)
            }}
        ></BarChart>
    );
};
