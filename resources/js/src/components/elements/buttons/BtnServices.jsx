import cx from "clsx";
import {
    ActionIcon,
    Button,
    rem,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import {
    IconBrandWhatsapp,
    IconChecks,
    IconMoon,
    IconSunHigh,
} from "@tabler/icons-react";

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
            //color="dark.7"
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
    disabled = false,
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
            disabled={disabled}
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
            radius="lg"
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

export const BtnSendWhatsapp = ({ handleAction }) => {
    return (
        <ActionIcon
        variant="light"
        color="#25D366"
        onClick={handleAction}
        size={35}
        radius="lg"
        aria-label="Btn send whatsapp"
        >
            <IconBrandWhatsapp
                stroke={1.8}
                color="#128C7E"
                style={{ width: rem(22), height: rem(22) }}
            />
        </ActionIcon>
    );
};
