import cx from "clsx";
import { Menu, Center, Box } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { MenuList } from "./MenuLinks";
import { useState } from "react";

export const GestionMenu = ({ title, menuData, usuario, classes, theme }) => {
    const [gestionMenuOpened, setGestionMenuOpened] = useState(false);

    return (
        <Menu
            transitionProps={{ transition: "pop-top-left" }}
            withArrow
            withinPortal
            shadow="md"
            onClose={() => setGestionMenuOpened(false)}
            onOpen={() => setGestionMenuOpened(true)}
        >
            <Menu.Target>
                <a
                    //href="#"
                    className={cx(classes.link, {
                        [classes.linkActive]: gestionMenuOpened,
                    })}
                >
                    <Center inline>
                        <Box component="span" mr={5}>
                            {title}
                        </Box>
                        <IconChevronDown
                            size={18}
                            color={theme.colors.dark[6]}
                        />
                    </Center>
                </a>
            </Menu.Target>
            <Menu.Dropdown>
                <MenuList usuario={usuario} menuData={menuData} theme={theme} />
            </Menu.Dropdown>
        </Menu>
    );
};
