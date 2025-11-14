import { useEffect } from "react";
import { Box, Burger, Group } from "@mantine/core";
import {
    //BtnSendWhatsapp,
    Logo,
    UserBtnHeader,
    WhatsAppModalResultados,
} from "../../components";
import { useResultadoStore } from "../../hooks";
import { Roles } from "../../helpers/dictionary";
import { GestionMenu } from "../menu/GestionMenu";
import { NavResultados, NavResultadosConsulta, NavRevisarActasConsulta } from "../menu/data/menuRoutes";
import { DrawerMenuMobile } from "../menu/DrawerMenuMobile";
import { LinkMenu } from "../menu/LinkMenu";
import {
    HEADER_MENU_CONSULTA,
    PREFIX_ROUTES,
} from "../../routes/router/routes";
import classes from "../../assets/styles/modules/layout/HeaderMenu.module.css";
import Swal from "sweetalert2";

const HeaderMenuConsulta = ({
    usuario,
    isOpenDrawerMobile,
    modalActionDrawerMobile,
    theme,
}) => {
    const { message, errores } = useResultadoStore();
    //const { modalActionWhatsApp } = useUiResultado();

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

    /* const handleOpenModal = (e) => {
        e.preventDefault();
        modalActionWhatsApp(true);
    }; */

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
                                    handleNavigation={`${PREFIX_ROUTES.ELECCIONES}${PREFIX_ROUTES.DIGITACION}/${HEADER_MENU_CONSULTA.DIGITACION_CONSULTA}`}
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <GestionMenu
                                    title="Resultados"
                                    menuData={NavResultadosConsulta}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <LinkMenu
                                    title="Escrutinio Acta"
                                    handleNavigation={`${PREFIX_ROUTES.ELECCIONES_CONSULTA}/${HEADER_MENU_CONSULTA.ESCRUTINIO_CONSULTA}`}
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}

                            {usuario.role === Roles.ADMINISTRADOR ? (
                                <LinkMenu
                                    title="Tendencia Mesas"
                                    handleNavigation={`${PREFIX_ROUTES.ELECCIONES_CONSULTA}/${HEADER_MENU_CONSULTA.SEGUIMIENTO_JUNTAS_CONSULTA}`}
                                    classes={classes}
                                    toggleDrawer={modalActionDrawerMobile}
                                />
                            ) : null}
                            {usuario.role === Roles.ADMINISTRADOR ||
                            usuario.role === Roles.RESPONSABLE ||
                            usuario.role === Roles.DIGITADOR ? (
                                <GestionMenu
                                    title="Actas Consulta"
                                    menuData={NavRevisarActasConsulta}
                                    usuario={usuario}
                                    classes={classes}
                                    theme={theme}
                                />
                            ) : null}
                        </Group>
                    </Group>

                    <Group visibleFrom="lg">
                        {/* {usuario.role === Roles.ADMINISTRADOR ? (
                            <BtnSendWhatsapp handleAction={handleOpenModal} />
                        ) : null} */}

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

export default HeaderMenuConsulta;
