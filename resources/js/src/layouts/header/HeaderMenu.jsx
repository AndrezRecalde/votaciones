import { useEffect } from "react";
import { Box, Burger, Group } from "@mantine/core";
import {
    BtnSendWhatsapp,
    Logo,
    UserBtnHeader,
    WhatsAppModalResultados,
} from "../../components";
import {
    useResultadoStore,
    useUiResultado,
} from "../../hooks";
import { Roles } from "../../helpers/dictionary";
import { GestionMenu } from "../menu/GestionMenu";
import { NavResultados } from "../menu/data/menuRoutes";
import { DrawerMenuMobile } from "../menu/DrawerMenuMobile";
import { LinkMenu } from "../menu/LinkMenu";
import classes from "../../assets/styles/modules/layout/HeaderMenu.module.css";
import Swal from "sweetalert2";

const HeaderMenu = ({
    usuario,
    isOpenDrawerMobile,
    modalActionDrawerMobile,
    theme,
}) => {
    const { isSendingWhats, message, errores } = useResultadoStore();
    const { modalActionWhatsApp } = useUiResultado();

    useEffect(() => {
        if (isSendingWhats) {
            Swal.fire({
                icon: "warning",
                text: "Un momento porfavor, se está enviando el mensaje...",
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close(); // Cierra el modal cuando isExport es false
        }
    }, [isSendingWhats]);

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

    const handleOpenModal = (e) => {
        e.preventDefault();
        modalActionWhatsApp(true);
    };

    return (
        <Box pb={30}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Group h="100%">
                        <Logo height={50} width={200} />
                        <Group h="100%" gap={0} visibleFrom="lg">
                            {usuario.role === Roles.DIGITADOR ||
                            usuario.role === Roles.RESPONSABLE ||
                            usuario.role === Roles.ADMINISTRADOR ? (
                                <LinkMenu
                                    title="Digitación Acta"
                                    handleNavigation={
                                        "/general/digitacion-acta"
                                    }
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <GestionMenu
                                    title="Resultados"
                                    menuData={NavResultados}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <LinkMenu
                                    title="Escrutinio Acta"
                                    handleNavigation={"/admin/escrutinio"}
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <LinkMenu
                                    title="Tendencia Mesas"
                                    handleNavigation={"/admin/tendencia"}
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <LinkMenu
                                    title="Revisar Actas"
                                    handleNavigation={"/admin/actas"}
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}
                        </Group>
                    </Group>

                    <Group visibleFrom="lg">
                        {usuario.role === Roles.ADMINISTRADOR ? (
                            <BtnSendWhatsapp handleAction={handleOpenModal} />
                        ) : null}

                        <UserBtnHeader classes={classes} />
                    </Group>

                    <Burger
                        opened={isOpenDrawerMobile}
                        onClick={() => modalActionDrawerMobile(true)}
                        hiddenFrom="lg"
                    />
                </Group>
            </header>

            <DrawerMenuMobile
                usuario={usuario}
                classes={classes}
                theme={theme}
            />

            <WhatsAppModalResultados />
        </Box>
    );
};

export default HeaderMenu;
