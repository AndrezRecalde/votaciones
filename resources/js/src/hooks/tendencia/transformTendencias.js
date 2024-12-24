export const transformTendencias = (tendencias) => {
    // Obtener nombres únicos de las juntas y candidatos
    const juntas = [...new Set(tendencias.map((item) => item.junta_nombre))];
    const candidatos = [
        ...new Set(tendencias.map((item) => item.nombre_candidato)),
    ];

    // Crear un mapeo para los colores de cada candidato
    const colorMap = {};
    tendencias.forEach((item) => {
        if (!colorMap[item.nombre_candidato]) {
            colorMap[item.nombre_candidato] = item.color;
        }
    });

    // Transformar los datos para que cada junta tenga votos por candidato
    const transformedData = juntas.map((junta) => {
        const juntaData = { junta_nombre: junta };

        candidatos.forEach((candidato) => {
            const entry = tendencias.find(
                (item) =>
                    item.junta_nombre === junta &&
                    item.nombre_candidato === candidato
            );
            juntaData[candidato] = entry ? parseInt(entry.total_votos, 10) : 0;
        });

        return juntaData;
    });

    // Crear las series para el gráfico
    const series = candidatos.map((candidato) => ({
        name: candidato,
        color: colorMap[candidato], // Asignar color desde el mapeo
    }));

    return { transformedData, series };
};
