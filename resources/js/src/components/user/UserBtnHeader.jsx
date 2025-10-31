import cx from "clsx";
import { useMemo, useState } from "react";
import {
    Avatar,
    Divider,
    Group,
    Menu,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { menuRoutes } from "../../routes/router/routes";
import { TextSection } from "../elements/titles/TextSection";
import { capitalizarCadaPalabra } from "../../helpers/fnHelpers";
import classes from "../../assets/styles/modules/user/UserHeader.module.css";

export const UserBtnHeader = () => {
    const { startLogout } = useAuthStore();
    const navigate = useNavigate();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    //const [nombres, setNombres] = useState("G");

    const usuario = useMemo(() => {
        const storedUser = localStorage.getItem("service_user");
        return storedUser ? JSON.parse(storedUser) : null;
    }, []);

    const nombres = useMemo(() => {
        if (!usuario || !usuario.nombres_completos) return "G"; // Valor predeterminado si `usuario` no tiene alias
        const [firstName = "", lastName = ""] =
            usuario.nombres_completos.split(" ");
        return `${firstName[0] || ""}${lastName[0] || ""}`;
    }, [usuario]);

    const handleMenuClick = (linked) => {
        navigate(linked);
    };

    return (
        <Menu
            width={320}
            shadow="md"
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, {
                        [classes.userActive]: userMenuOpened,
                    })}
                    aria-hidden={false}
                >
                    <Group gap={20}>
                        <Avatar alt={nombres} variant="default" radius="xl">
                            {nombres}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                            <TextSection tt="" fw={600} fz="sm">
                                {typeof usuario?.nombres_completos === "string"
                                    ? capitalizarCadaPalabra(usuario.nombres_completos)
                                    : "Sin datos"}
                            </TextSection>
                            <TextSection fs="italic" fz={14} fw={700}>
                                {usuario?.role ?? "Sin datos"}
                            </TextSection>
                        </div>
                        <IconChevronRight
                            style={{ width: rem(20), height: rem(20) }}
                            stroke={1.5}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Group justify="space-between" p={20}>
                    <Avatar
                        alt={nombres}
                        variant="default"
                        radius="xl"
                        //color="teal.7"
                        size="lg"
                    >
                        {nombres}
                    </Avatar>
                    <div>
                        <TextSection tt="" fz={15} fw={500}>
                            {typeof usuario?.nombres_completos === "string"
                                ? capitalizarCadaPalabra(
                                      usuario.nombres_completos
                                  )
                                : "Sin datos"}{" "}
                            <br />
                        </TextSection>
                        <TextSection tt="" fz={15} fs="italic" fw={300}>
                            {usuario?.role || "Sin datos"}
                        </TextSection>
                    </div>
                </Group>
                <Divider mb={10} />
                {menuRoutes
                    .slice(0, -1)
                    .map(({ label, path, link, icon: Icon, color, role }) => {
                        if (role && role !== usuario?.role) return null;
                        return (
                            <Menu.Item
                                key={path}
                                onClick={() => handleMenuClick(link)}
                                color={color}
                                leftSection={
                                    <Icon
                                        style={{
                                            width: rem(18),
                                            height: rem(18),
                                        }}
                                        stroke={1.5}
                                    />
                                }
                            >
                                {label}
                            </Menu.Item>
                        );
                    })}

                <Menu.Label>Sesión</Menu.Label>
                <Menu.Item
                    onClick={startLogout}
                    color={menuRoutes.at(-1).color}
                    leftSection={
                        <IconLogout
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.5}
                        />
                    }
                >
                    {menuRoutes.at(-1).label}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
