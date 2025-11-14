import { useEffect, useState } from "react";
import { Box, Container, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    ActaAccionesBtnSection,
    ActaConsultaVotosSection,
    ActaInformacionUsuario,
    ActaValidacionSection,
    JuntaInformacionSection,
} from "../../../components";
import { useActaConsultaStore } from "../../../hooks";

// Normaliza valores a número (vacío/null -> 0)
const toNum = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
};

export const ActaConsultaSection = () => {
    const { info_acta, startAddActa, startClearActaConsulta } =
        useActaConsultaStore();

    // Totales por pregunta: [{ index, pregunta_id, total, coincide }]
    const [totalesPorPregunta, setTotalesPorPregunta] = useState([]);

    const actaForm = useForm({
        initialValues: {
            provincia_id: "",
            canton_id: "",
            parroquia_id: "",
            zona_id: "",
            junta_id: "",

            cod_cne: "",
            votos_validos: "",
            preguntas: [],

            cuadrada: false,
            legible: true,
            estado: true,
        },
        validate: {
            votos_validos: (value) =>
                value === ""
                    ? "Por favor ingrese el total de votos válidos"
                    : toNum(value) < 0
                    ? "El total de votos válidos no puede ser negativo"
                    : null,
        },
        transformValues: (values) => ({
            id: values.id ? Number(values.id) : null,
            junta_id: Number(values.junta_id),
            cod_cne: values.cod_cne?.trim() || "",
            votos_validos: Number(values.votos_validos) || 0,
            cuadrada: Boolean(values.cuadrada),
            legible: Boolean(values.legible),
            estado: Boolean(values.estado),
            preguntas: (values.preguntas || []).map((p) => ({
                pregunta_id: Number(p.pregunta_id),
                votos_si: Number(p.votos_si ?? 0),
                votos_no: Number(p.votos_no ?? 0),
                votos_blancos: Number(p.votos_blancos ?? 0),
                votos_nulos: Number(p.votos_nulos ?? 0),
            })),
        }),
    });

    const { votos_validos, legible } = actaForm.values;

    /**
     * Calcula total por cada pregunta y determina cuadrada:
     * cuadrada = true si TODAS las preguntas tienen total == votos_validos (y hay al menos una pregunta)
     */
    useEffect(() => {
        const votosValidosActa = toNum(actaForm.values.votos_validos);
        const preguntas = actaForm.values.preguntas || [];

        const next = preguntas.map((p, index) => {
            const total =
                toNum(p.votos_si) +
                toNum(p.votos_no) +
                toNum(p.votos_blancos) +
                toNum(p.votos_nulos);

            const coincide =
                votosValidosActa > 0 &&
                total === votosValidosActa &&
                preguntas.length > 0;

            return {
                index,
                pregunta_id: p.pregunta_id ?? null,
                total,
                coincide,
            };
        });

        // Actualizar estado si hubo cambios
        const isSameLength = totalesPorPregunta.length === next.length;
        let changed = !isSameLength;
        if (!changed) {
            for (let i = 0; i < next.length; i++) {
                const a = totalesPorPregunta[i];
                const b = next[i];
                if (
                    a.index !== b.index ||
                    String(a.pregunta_id) !== String(b.pregunta_id) ||
                    a.total !== b.total ||
                    a.coincide !== b.coincide
                ) {
                    changed = true;
                    break;
                }
            }
        }
        if (changed) setTotalesPorPregunta(next);

        // Determinar cuadrada global
        const hayPreguntas = next.length > 0;
        const todasCoinciden =
            hayPreguntas &&
            votosValidosActa > 0 &&
            next.every((t) => t.total === votosValidosActa);

        if (actaForm.values.cuadrada !== todasCoinciden) {
            actaForm.setFieldValue("cuadrada", todasCoinciden);
        }
    }, [
        actaForm.values.votos_validos,
        actaForm.values.preguntas,
        totalesPorPregunta,
        actaForm.values.cuadrada,
    ]);

    const esCuadrada = actaForm.values.cuadrada;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = actaForm.getTransformedValues();
        //console.log(payload);
        startAddActa(payload); // internamente POST o PUT
        actaForm.reset();
        startClearActaConsulta();
    };

    return (
        <Container size="xxl">
            <Box
                component="form"
                onSubmit={actaForm.onSubmit((_, e) => handleSubmit(e))}
            >
                <JuntaInformacionSection />
                <ActaConsultaVotosSection
                    actaForm={actaForm}
                    totalesPorPregunta={totalesPorPregunta}
                    votosValidosActa={toNum(votos_validos)}
                />

                <SimpleGrid cols={2} mb={20}>
                    <ActaValidacionSection
                        actaForm={actaForm}
                        esCuadrada={esCuadrada}
                        legible={legible}
                    />
                    <ActaInformacionUsuario
                        existeActaConsulta={info_acta.existe_acta}
                        info_acta={info_acta}
                    />
                </SimpleGrid>

                <ActaAccionesBtnSection
                    actaForm={actaForm}
                    esCuadrada={esCuadrada}
                />
            </Box>
        </Container>
    );
};
