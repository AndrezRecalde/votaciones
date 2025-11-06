import { Box, Container, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { JuntaInformacionSection } from "../../../../components";
import { useStorageStore } from "../../../../hooks";

export const ActaConsultaSection = () => {
    const { selectedFields } = useStorageStore();

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
            cuadrada: true,
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
            provincia_id: Number(selectedFields.provincia_id),
            canton_id: Number(selectedFields.canton_id),
            parroquia_id: Number(selectedFields.parroquia_id),
            zona_id: Number(selectedFields.zona_id),
            junta_id: Number(selectedFields.junta_id),
            pregunta_id: Number(selectedFields.pregunta_id),
            votos_si: Number(values.votos_si) || 0,
            votos_no: Number(values.votos_no) || 0,
            votos_validos: Number(values.votos_validos) || 0,
            votos_blancos: Number(values.votos_blancos) || 0,
            votos_nulos: Number(values.votos_nulos) || 0,
        }),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(actaForm.getTransformedValues());
        actaForm.reset();
    };

    return (
        <Container size="xxl">
            <Box
                component="form"
                onSubmit={actaForm.onSubmit((_, e) => handleSubmit(e))}
            >
                <JuntaInformacionSection />
            </Box>
        </Container>
    );
};
