import { useMemo } from "react";
import { AppShell } from "@mantine/core";
import HeaderMenu from "../header/HeaderMenu";
import classes from "../../assets/styles/modules/layout/AppBody.module.css";

const AppHeaderMenu = ({ children }) => {
    const usuario = useMemo(() => {
        return JSON.parse(localStorage.getItem("service_user")) || {};
    }, []);
    return (
        <AppShell
            header={{ height: { base: 48, sm: 60, lg: 60 } }}
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
            padding={30}
        >
            <AppShell.Header>
                <HeaderMenu usuario={usuario} />
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
