import { Drawer, Group, ScrollArea } from "@mantine/core";
import { useUiHeaderMenu } from "../../hooks";
import { UserBtnMobile } from "./UserBtnMobile";
import { Roles } from "../../helpers/dictionary";
import { NavResultados } from "./data/menuRoutes";
import { MenuSection } from "./MenuSection";

export const DrawerMenuMobile = ({ usuario, classes, theme }) => {
    const {
        isOpenDrawerMobile,
        isOpenMenuLinksResultados,
        modalMenuLinksResultados,
        modalActionDrawerMobile,
    } = useUiHeaderMenu();

    return (
        <Drawer
            opened={isOpenDrawerMobile}
            onClose={() => modalActionDrawerMobile(false)}
            size="100%"
            padding="md"
            title="Menú"
            hiddenFrom="lg"
            zIndex={1000000}
            classNames={{
                body: classes.drawer,
                header: classes.drawer,
            }}
        >
            <ScrollArea h="calc(100vh - 80px" mx="-md">
                {usuario.role === Roles.ADMINISTRADOR ? (
                    <MenuSection
                        title="Resultados"
                        usuario={usuario}
                        menuData={NavResultados}
                        classes={classes}
                        theme={theme}
                        isOpen={isOpenMenuLinksResultados}
                        toggle={modalMenuLinksResultados}
                        toggleDrawer={modalActionDrawerMobile}
                    />
                ) : null}

                <Group justify="center" mt={20} mb={20} p={20}>
                    <UserBtnMobile />
                </Group>
            </ScrollArea>
        </Drawer>
    );
};
