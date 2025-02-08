import { useEffect, useMemo } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import {
    Box,
    Burger,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
    BtnDarkMode,
    BtnSendWhatsapp,
    Logo,
    UserBtnHeader,
    WhatsAppModalResultados,
} from "../../components";
import {
    HEADER_MENU,
    navResultados,
    PREFIX_ROUTES,
} from "../../routes/router/routes";
import classes from "../../assets/styles/modules/layout/HeaderMenu.module.css";
import { useResultadoStore, useUiResultado } from "../../hooks";
import Swal from "sweetalert2";

const HeaderMenu = () => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);

    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();

    const links = navResultados.map((item) => (
        <UnstyledButton
            className={item.disabled ? classes.subLinkDisa : classes.subLink}
            key={item.title}
        >
            <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size={30} variant="default" radius="md">
                    <item.icon
                        size={22}
                        color={
                            item.disabled
                                ? theme.colors.gray[5]
                                : theme.colors.indigo[6]
                        }
                    />
                </ThemeIcon>
                <Link
                    to={item.to}
                    className={item.disabled ? classes.linkR : classes.linkA}
                >
                    <Text size="sm" fw={500}>
                        {item.title}
                    </Text>
                </Link>
            </Group>
        </UnstyledButton>
    ));
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
        <Box pb={120}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    {/* Logo */}
                    <Logo height={70} width={45} mx={10} />
                    {usuario.role === "ADMIN" ||
                    usuario.role === "RESPONSABLE" ? (
                        <Group h="100%" gap={0} visibleFrom="sm">
                            <NavLink
                                to={`${PREFIX_ROUTES.DIGITADOR}/${HEADER_MENU.DIGITACION}`}
                                className={classes.link}
                            >
                                Digitación
                            </NavLink>
                            <HoverCard
                                position="bottom"
                                radius="md"
                                shadow="md"
                                withinPortal
                            >
                                <HoverCard.Target>
                                    <a href="#" className={classes.link}>
                                        <Center inline>
                                            <Box component="span" mr={5}>
                                                Resultados
                                            </Box>
                                            <IconChevronDown
                                                size={16}
                                                color={theme.colors.indigo[6]}
                                            />
                                        </Center>
                                    </a>
                                </HoverCard.Target>

                                <HoverCard.Dropdown
                                    style={{ overflow: "hidden" }}
                                >
                                    <SimpleGrid cols={1} spacing={0}>
                                        {links}
                                    </SimpleGrid>
                                </HoverCard.Dropdown>
                            </HoverCard>
                            <NavLink
                                to={`${PREFIX_ROUTES.ADMIN}/${HEADER_MENU.ESCRUTINIO}`}
                                className={classes.link}
                            >
                                Escrutinio
                            </NavLink>
                            <NavLink
                                to={`${PREFIX_ROUTES.ADMIN}/${HEADER_MENU.TENDENCIA}`}
                                className={classes.link}
                            >
                                Tendencia
                            </NavLink>
                            <NavLink
                                to={`${PREFIX_ROUTES.ADMIN}/${HEADER_MENU.ACTAS}`}
                                className={classes.link}
                            >
                                Actas
                            </NavLink>
                        </Group>
                    ) : (
                        <Group h="100%" gap={0} visibleFrom="sm">
                            <NavLink
                                to={`${PREFIX_ROUTES.DIGITADOR}/${HEADER_MENU.DIGITACION}`}
                                className={classes.link}
                            >
                                Digitación
                            </NavLink>
                        </Group>
                    )}

                    <Group visibleFrom="sm">
                        {usuario.role === "ADMIN" ? (
                            <BtnSendWhatsapp handleAction={handleOpenModal} />
                        ) : null}

                        <BtnDarkMode classes={classes} />
                        <UserBtnHeader classes={classes} />
                    </Group>

                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        hiddenFrom="sm"
                    />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Menú"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                {usuario.role === "ADMIN" ? (
                    <ScrollArea h="calc(100vh - 80px" mx="-md">
                        <Divider my="sm" />
                        <NavLink
                            to={`${PREFIX_ROUTES.DIGITADOR}/${HEADER_MENU.DIGITACION}`}
                            className={classes.link}
                        >
                            Digitación
                        </NavLink>
                        <UnstyledButton
                            className={classes.link}
                            onClick={toggleLinks}
                        >
                            <Center inline>
                                <Box component="span" mr={5}>
                                    Resultados
                                </Box>
                                <IconChevronDown
                                    size={16}
                                    color={theme.colors.indigo[6]}
                                />
                            </Center>
                        </UnstyledButton>
                        <Collapse in={linksOpened}>{links}</Collapse>
                        <NavLink
                            to={`${PREFIX_ROUTES.ADMIN}/${HEADER_MENU.ESCRUTINIO}`}
                            className={classes.link}
                        >
                            Escrutinio
                        </NavLink>
                        <NavLink
                            to={`${PREFIX_ROUTES.ADMIN}/${HEADER_MENU.TENDENCIA}`}
                            className={classes.link}
                        >
                            Tendencia
                        </NavLink>
                        <NavLink
                            to={`${PREFIX_ROUTES.ADMIN}/${HEADER_MENU.ACTAS}`}
                            className={classes.link}
                        >
                            Actas
                        </NavLink>

                        <Divider my="sm" />

                        <Group justify="center" grow pb="xl" px="md">
                            {usuario.role === "ADMIN" ? (
                                <BtnSendWhatsapp
                                    handleAction={handleOpenModal}
                                />
                            ) : null}
                            <BtnDarkMode classes={classes} />
                            <UserBtnHeader
                                classes={classes}
                                toggleMobile={closeDrawer}
                            />
                        </Group>
                    </ScrollArea>
                ) : (
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <NavLink
                            to={`${PREFIX_ROUTES.DIGITADOR}/${HEADER_MENU.DIGITACION}`}
                            className={classes.link}
                        >
                            Digitación
                        </NavLink>
                    </Group>
                )}
            </Drawer>
            <Outlet />
            <WhatsAppModalResultados />
        </Box>
    );
};

export default HeaderMenu;
