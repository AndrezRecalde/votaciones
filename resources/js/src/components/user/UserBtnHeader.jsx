import cx from "clsx";
import { useMemo, useState } from "react";
import { Avatar, Divider, Group, Menu, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { menuRoutes } from "../../routes/router/routes";
import { TextSection } from "../elements/titles/TextSection";

export const UserBtnHeader = ({ classes, toggleMobile = null }) => {
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
        if (toggleMobile) {
            toggleMobile(true);
        }
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
                        <Avatar
                            alt={nombres}
                            variant="light"
                            radius="xl"
                            color="indigo.7"
                        >
                            {nombres}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                            <Text fw={500} size="sm">
                                {usuario?.nombres_completos || "Sin datos"}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {usuario?.role || "Sin datos"}
                            </Text>
                        </div>
                        <IconChevronRight
                            style={{ width: rem(12), height: rem(12) }}
                            stroke={1.5}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Group justify="space-between" p={20}>
                    <Avatar
                        alt={nombres}
                        variant="light"
                        radius="xl"
                        color="indigo.7"
                        size="lg"
                    >
                        {nombres}
                    </Avatar>
                    <div>
                        <TextSection tt="" fw={500} size="sm">
                            {usuario?.nombres_completos || "Sin datos"} <br />
                        </TextSection>
                        <TextSection tt="" fs="italic" fw={300} size="sm">
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
