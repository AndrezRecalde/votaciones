export const transformTendencias = (tendencias) => {
    // Obtener nombres únicos de las juntas (categorías del eje X)
    const categories = [
        ...new Set(tendencias.map((item) => item.junta_nombre)),
    ];

    // Obtener candidatos únicos
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

    // Crear un mapeo de junta a recinto
    const recintoMap = {};
    tendencias.forEach((item) => {
        if (!recintoMap[item.junta_nombre]) {
            recintoMap[item.junta_nombre] =
                item.recinto_nombre || item.nombre_recinto || "Sin recinto";
        }
    });

    // Crear las series para Highcharts
    const series = candidatos.map((candidato) => {
        const data = categories.map((junta) => {
            const entry = tendencias.find(
                (item) =>
                    item.junta_nombre === junta &&
                    item.nombre_candidato === candidato
            );
            return entry ? parseInt(entry.total_votos, 10) : 0;
        });

        return {
            name: candidato,
            data: data,
            color: colorMap[candidato],
        };
    });

    return { categories, series, recintoMap };
};
