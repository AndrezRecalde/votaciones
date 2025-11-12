export const transformTendenciaConsulta = (tendencias = []) => {
    if (!Array.isArray(tendencias)) tendencias = [];

    // Limpiar y normalizar
    const sane = tendencias
        .map((t) => ({
            junta_nombre: String(t.junta_nombre || "").trim(),
            nombre_recinto: String(t.nombre_recinto || "").trim(),
            casillero_pregunta: String(t.casillero_pregunta || "").trim(),
            texto_pregunta: String(t.texto_pregunta || "").trim(),
            votos_si: parseInt(t.votos_si, 10) || 0,
            votos_no: parseInt(t.votos_no, 10) || 0,
        }))
        .filter((t) => t.junta_nombre && t.casillero_pregunta);

    const juntas = [...new Set(sane.map((t) => t.junta_nombre))].sort();
    const preguntas = [
        ...new Set(sane.map((t) => t.casillero_pregunta)),
    ].sort();

    // Mapeos auxiliares
    const recintoPorJunta = {};
    const detallePorJuntaPregunta = {};

    sane.forEach((t) => {
        if (!recintoPorJunta[t.junta_nombre]) {
            recintoPorJunta[t.junta_nombre] = t.nombre_recinto || "Sin recinto";
        }
        const key = `${t.junta_nombre}||${t.casillero_pregunta}`;
        detallePorJuntaPregunta[key] = {
            texto_pregunta: t.texto_pregunta,
            votos_si: t.votos_si,
            votos_no: t.votos_no,
        };
    });

    // Paletas (una por pregunta, consistente entre SÍ y NO)
    const paletteSi = [
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
        "#F59E0B",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
        "#6366F1",
    ];
    const paletteNo = [
        "#EF4444",
        "#2563EB",
        "#7C3AED",
        "#D97706",
        "#DB2777",
        "#0E7490",
        "#4D7C0F",
        "#4338CA",
    ];

    // Crear las series: para cada pregunta dos series (SÍ y NO) con stack = pregunta
    const series = [];
    preguntas.forEach((pregunta, idx) => {
        // Serie Votos SÍ
        const dataSi = juntas.map((junta) => {
            const key = `${junta}||${pregunta}`;
            const detalle = detallePorJuntaPregunta[key];
            return detalle ? detalle.votos_si : 0;
        });
        series.push({
            name: `Pregunta ${pregunta} - SÍ`,
            stack: pregunta,
            data: dataSi,
            color: paletteSi[idx % paletteSi.length],
        });

        // Serie Votos NO
        const dataNo = juntas.map((junta) => {
            const key = `${junta}||${pregunta}`;
            const detalle = detallePorJuntaPregunta[key];
            return detalle ? detalle.votos_no : 0;
        });
        series.push({
            name: `Pregunta ${pregunta} - NO`,
            stack: pregunta,
            data: dataNo,
            color: paletteNo[idx % paletteNo.length],
        });
    });

    return {
        juntas,
        preguntas,
        series,
        recintoPorJunta,
        detallePorJuntaPregunta,
    };
};
