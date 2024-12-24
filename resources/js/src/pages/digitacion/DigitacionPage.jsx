import { useEffect } from "react";
import { Container } from "@mantine/core";
import { SeleccionForm, TitlePage } from "../../components";
import { useActaStore } from "../../hooks";
import ActaPage from "./ActaPage";
import Swal from "sweetalert2";

const DigitacionPage = () => {
    const { pageLoad, startClearActa, message, errores } = useActaStore();

    /* useEffect(() => {
        return () => {
            startClearActa();
        };
    }, []); */

    useEffect(() => {
        if (message !== undefined) {
            Swal.fire({
                icon: message.status,
                text: message.msg,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
    }, [message]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                title: "Opps...",
                text: errores,
                confirmButtonColor: "#094293",
            });
            return;
        }
    }, [errores]);

    return (
        <Container size="xxl">
            <TitlePage order={2}>Acta de Escrutinio</TitlePage>
            <SeleccionForm />
            {pageLoad ? <ActaPage /> : null}
        </Container>
    );
};

export default DigitacionPage;
