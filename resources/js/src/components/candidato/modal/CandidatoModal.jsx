import { useEffect } from "react";
import { Modal } from "@mantine/core";
import { CandidatoForm, TextSection } from "../../../components";
import { isNotEmpty, useForm } from "@mantine/form";
import { useCandidatoStore, useDignidadStore, useDistritoStore, useJurisdiccionStore, useOrganizacionStore, useUiCandidato } from "../../../hooks";

export const CandidatoModal = () => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const { setActivateCandidato } = useCandidatoStore();
    const { isOpenModalCandidato, modalActionCandidato } = useUiCandidato();
    const { startLoadProvincias, startClearJurisdicciones } = useJurisdiccionStore();
    const { startLoadOrganizaciones, startClearOrganizaciones } = useOrganizacionStore();
    const { startLoadDignidades, startClearDignidades } = useDignidadStore();
    const { startLoadDistritos, startClearDistritos } = useDistritoStore();

    const form = useForm({
        initialValues: {
            organizacion_id: null,
            dignidad_id: null,
            distrito_id: null,
            provincia_id: null,
            canton_id: null,
            parroquia_id: null,
            nombre_candidato: "",
        },
        validate: {
            organizacion_id: isNotEmpty(
                "Por favor seleccione una organización"
            ),
            dignidad_id: isNotEmpty("Por favor seleccione dignidad"),
            distrito_id: isNotEmpty("Por favor seleccione el distrito"),
            nombre_candidato: isNotEmpty("Digite el nombre del candidato"),
            provincia_id: isNotEmpty("Por favor seleccione la provincia"),
        },
        transformValues: (values) => ({
            ...values,
            organizacion_id: Number(values.organizacion_id) || null,
            dignidad_id: Number(values.dignidad_id) || null,
            distrito_id: Number(values.distrito_id) || null,
            provincia_id: Number(values.provincia_id) || null,
        }),
    });

    useEffect(() => {
        if (isOpenModalCandidato) {
            startLoadProvincias({ provincia_id: usuario.provincia_id });
            startLoadOrganizaciones();
            startLoadDignidades({ activo: true });
            startLoadDistritos();
        }

        return () => {
            startClearJurisdicciones();
            startClearOrganizaciones();
            startClearDignidades();
            startClearDistritos();
        }
    }, [isOpenModalCandidato]);

    const handleCloseModal = () => {
        setActivateCandidato(null);
        form.reset();
        modalActionCandidato(false);
    };

    return (
        <Modal
            opened={isOpenModalCandidato}
            onClose={handleCloseModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Candidato
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            radius="lg"
            size="lg"
        >
            <CandidatoForm form={form} />
        </Modal>
    );
};
