import { AppShell, useMantineTheme } from "@mantine/core";
import { useUiHeaderMenu } from "../../hooks";
//import HeaderMenu from "../header/HeaderMenu";
import classes from "../../assets/styles/modules/layout/AppBody.module.css";
import HeaderMenuConsulta from "../header/HeaderMenuConsulta";

const AppHeaderMenu = ({ children }) => {
    const usuario = JSON.parse(localStorage.getItem("service_user")) || {};
    const { isOpenDrawerMobile, modalActionDrawerMobile } = useUiHeaderMenu();
    const theme = useMantineTheme();

    return (
        <AppShell
            header={{ height: { base: 48, sm: 65, lg: 65 } }}
            /* navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }} */
            /* aside={{
                width: 300,
                breakpoint: "md",
                collapsed: { desktop: !isOpenModalAside, mobile: true }, // Controla el Aside
            }} */
            padding={30}
        >
            <AppShell.Header>
                <HeaderMenuConsulta
                    usuario={usuario}
                    isOpenDrawerMobile={isOpenDrawerMobile}
                    modalActionDrawerMobile={modalActionDrawerMobile}
                    theme={theme}
                />
            </AppShell.Header>
            {/* <AppShell.Navbar p="md">
                Navbar
                {Array(15)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} h={28} mt="sm" animate={false} />
                    ))}
            </AppShell.Navbar> */}
            <AppShell.Main className={classes.body}>{children}</AppShell.Main>
            {/*  <AppShell.Aside
                className={classes.body}
                p="sm"
                component={ScrollArea}
            >
                <StackAside modalAside={modalActionAside} />
            </AppShell.Aside> */}
            {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
        </AppShell>
    );
};

export default AppHeaderMenu;
