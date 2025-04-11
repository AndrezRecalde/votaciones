import { AppShell } from "@mantine/core";
import HeaderMenu from "../header/HeaderMenu";
import classes from "../../assets/styles/modules/layout/HeaderMenu.module.css";
import { useMemo } from "react";

const AppHeaderMenu = ({ children }) => {
    const usuario = useMemo(() => {
            return JSON.parse(localStorage.getItem("service_user")) || {};
        }, []);
    return (
        <AppShell
            header={{ height: 65 }}
            footer={{ height: 65 }}
            /* navbar={{
                width: 200,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }} */
            /* aside={{
                width: 300,
                breakpoint: "md",
                collapsed: { desktop: !isOpenModalAside, mobile: true }, // Controla el Aside
            }} */
            padding="md"
        >
            <AppShell.Header>
                <HeaderMenu
                    usuario={usuario}
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
            <AppShell.Main className={classes.body}>
                {children}
            </AppShell.Main>
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
