import {
    Menu,
    Stack,
    Text,
    ThemeIcon,
    UnstyledButton,
} from "@mantine/core";
import { Link } from "react-router-dom";

export const MenuList = ({ usuario, menuData, theme }) => {
    return Object.entries(menuData).map(([category, items]) => {
        // Filtramos los items permitidos según el role del usuario
        const allowedItems = items.filter((item) =>
            item.roles.includes(usuario.role)
        );

        // Si no hay items permitidos, no renderizamos nada para esta categoría
        if (allowedItems.length === 0) return null;

        return (
            <div key={category}>
                <Menu.Label>{category}</Menu.Label>
                <Menu.Divider />
                {allowedItems.map((item) => (
                    <Menu.Item
                        key={item.title}
                        leftSection={
                            <item.icon size={18} color={theme.colors.gray[8]} />
                        }
                        component={Link}
                        to={item.link}
                    >
                        {item.title}
                    </Menu.Item>
                ))}
            </div>
        );
    });
};

export const MenuItems = ({
    menuHome,
    classes,
    theme,
    toggleDrawer = null,
}) => {
    const handleCloseDrawer = () => {
        if (toggleDrawer) toggleDrawer(false);
    };

    return menuHome.map((item) => (
        <UnstyledButton
            key={item.title}
            component={Link}
            to={item.link}
            className={classes.card}
            onClick={handleCloseDrawer}
        >
            <div className={classes.cardInner}>
                <Stack align="center">
                    <ThemeIcon
                        size={50}
                        radius="md"
                        variant="outline"
                        color={theme.colors[item.color][8]}
                        className={classes.icon}
                    >
                        <item.icon size={27} stroke={1.8} />
                    </ThemeIcon>

                    <Text className={classes.title} size="md">
                        {item.title}
                    </Text>

                    {item.description && (
                        <Text
                            className={classes.description}
                            size="sm"
                            c="dimmed"
                        >
                            {item.description}
                        </Text>
                    )}
                </Stack>
            </div>
        </UnstyledButton>
    ));
};
