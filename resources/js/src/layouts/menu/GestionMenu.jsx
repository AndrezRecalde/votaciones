import { Menu, Center, Box } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { MenuList } from "./MenuLinks";

export const GestionMenu = ({ title, menuData, usuario, classes, theme }) => (
    <Menu
        transitionProps={{ transition: "pop-top-left" }}
        withArrow
        withinPortal
        shadow="md"
    >
        <Menu.Target>
            <a href="#" className={classes.link}>
                <Center inline>
                    <Box component="span" mr={5}>
                        {title}
                    </Box>
                    <IconChevronDown size={18} color={theme.colors.dark[6]} />
                </Center>
            </a>
        </Menu.Target>
        <Menu.Dropdown>
            <MenuList usuario={usuario} menuData={menuData} theme={theme} />
        </Menu.Dropdown>
    </Menu>
);
