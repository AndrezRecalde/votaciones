import { LineChart } from "@mantine/charts";
import { transformTendencias, useTendenciaStore } from "../../hooks";

export const TendenciaChart = () => {
    const { tendencias } = useTendenciaStore();

    // Transformar los datos
    const { transformedData, series } = transformTendencias(tendencias);

    return (
        <LineChart
            h={300}
            withLegend
            legendProps={{ verticalAlign: 'top' }}
            data={transformedData} // Datos transformados
            dataKey="junta_nombre" // Eje X
            strokeDasharray="15 15"
            series={series} // Series generadas dinámicamente
        />
    );
};
