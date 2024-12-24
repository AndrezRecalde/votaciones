import cx from "clsx";
import { ActionIcon, Button, rem, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconChecks, IconMoon, IconSunHigh } from "@tabler/icons-react";

export const BtnSubmit = ({
    children,
    fullwidth = true,
    heigh = 45,
    fontSize = 18,
    IconSection = IconChecks,
    loading = false,
    disabled = false,
}) => {
    return (
        <Button
            color="indigo.5"
            type="submit"
            fullWidth={fullwidth}
            mt="md"
            mb="md"
            rightSection={<IconSection />}
            disabled={disabled}
            loading={loading}
            loaderProps={{ type: "dots" }}
            styles={{
                root: {
                    "--button-height": rem(heigh),
                },
                inner: {
                    fontSize: fontSize,
                },
            }}
        >
            {children}
        </Button>
    );
};

export const BtnSection = ({
    fullWidth = false,
    heigh = 40,
    fontSize = 14,
    mb = 0,
    mt = 0,
    IconSection,
    handleAction,
    children,
}) => {
    return (
        <Button
            mt={mt}
            mb={mb}
            fullWidth={fullWidth}
            variant="default"
            leftSection={<IconSection color={"#6d79f7"} />}
            styles={{
                root: {
                    "--button-height": rem(heigh),
                },
                inner: {
                    fontSize: fontSize,
                },
            }}
            onClick={handleAction}
        >
            {children}
        </Button>
    );
};

export const BtnDarkMode = ({ classes }) => {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });
    return (
        <ActionIcon
            variant="default"
            onClick={() =>
                setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                )
            }
            size={35}
            radius="md"
            aria-label="Toggle color scheme"
        >
            <IconSunHigh
                className={cx(classes.icon, classes.light)}
                stroke={1.5}
                style={{ width: rem(22), height: rem(22) }}
            />

            <IconMoon
                className={cx(classes.icon, classes.dark)}
                stroke={1.5}
                style={{ width: rem(22), height: rem(22) }}
            />
        </ActionIcon>
    );
};
