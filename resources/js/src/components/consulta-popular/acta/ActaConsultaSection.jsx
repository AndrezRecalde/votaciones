import { useEffect, useState } from "react";
import { Box, Container, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    ActaAccionesBtnSection,
    ActaConsultaVotosSection,
    ActaInformacionUsuario,
    ActaResumenTotalVotos,
    ActaValidacionSection,
    JuntaInformacionSection,
} from "../../../components";
import { useActaConsultaStore } from "../../../hooks";
//import { useStorageStore } from "../../../hooks";

export const ActaConsultaSection = () => {
    //const { selectedFields } = useStorageStore();
    const { existeActaConsulta, pregunta, startAddActa, startClearActaConsulta } =
        useActaConsultaStore();
    const [totales, setTotales] = useState(0);

    const actaForm = useForm({
        initialValues: {
            provincia_id: "",
            canton_id: "",
            parroquia_id: "",
            zona_id: "",
            junta_id: "",
            pregunta_id: "",
            cod_cne: "",
            votos_si: "",
            votos_no: "",
            votos_validos: "",
            votos_blancos: "",
            votos_nulos: "",
            cuadrada: false,
            legible: true,
        },
        validate: {
            votos_validos: (value) =>
                value === "" ? "Por favor ingrese los votos válidos" : null,
            votos_blancos: (value) =>
                value === "" ? "Por favor ingrese los votos blancos" : null,
            votos_nulos: (value) =>
                value === "" ? "Por favor ingrese los votos nulos" : null,
        },
        transformValues: (values) => ({
            ...values,
            /* provincia_id: Number(selectedFields.provincia_id),
            canton_id: Number(selectedFields.canton_id),
            parroquia_id: Number(selectedFields.parroquia_id),
            zona_id: Number(selectedFields.zona_id),
            junta_id: Number(selectedFields.junta_id),
            pregunta_id: Number(selectedFields.pregunta_id), */
            votos_si: Number(values.votos_si) || 0,
            votos_no: Number(values.votos_no) || 0,
            votos_validos: Number(values.votos_validos) || 0,
            votos_blancos: Number(values.votos_blancos) || 0,
            votos_nulos: Number(values.votos_nulos) || 0,
        }),
    });

    const {
        votos_validos,
        votos_blancos,
        votos_nulos,
        votos_si,
        votos_no,
        legible,
    } = actaForm.values;

    useEffect(() => {
        if (
            votos_validos ===
            votos_blancos + votos_nulos + votos_si + votos_no
        ) {
            actaForm.setFieldValue("cuadrada", true);
        } else {
            actaForm.setFieldValue("cuadrada", false);
        }
    }, [votos_validos, votos_blancos, votos_nulos, votos_si, votos_no]);

    useEffect(() => {
        setTotales(
            Math.abs(
                Number(votos_si) +
                    Number(votos_no) +
                    Number(votos_blancos) +
                    Number(votos_nulos)
            )
        );

        return () => {
            setTotales(0);
        };
    }, [votos_si, votos_no, votos_blancos, votos_nulos]);

    const esCuadrada =
        votos_validos === votos_blancos + votos_nulos + votos_si + votos_no;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(actaForm.getTransformedValues());
        startAddActa(actaForm.getTransformedValues());
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
                <ActaConsultaVotosSection actaForm={actaForm} />
                <SimpleGrid cols={3} mb={20}>
                    <ActaValidacionSection
                        actaForm={actaForm}
                        esCuadrada={esCuadrada}
                        legible={legible}
                    />
                    <ActaResumenTotalVotos
                        esCuadrada={esCuadrada}
                        votos_validos={votos_validos}
                        totales={totales}
                    />
                    <ActaInformacionUsuario
                        existeActaConsulta={existeActaConsulta}
                        pregunta={pregunta}
                    />
                </SimpleGrid>
                <ActaAccionesBtnSection actaForm={actaForm} />
            </Box>
        </Container>
    );
};
