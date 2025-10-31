import { Image } from "@mantine/core";
import logo from "../../../assets/images/LogoMediano.png";

export const Logo = ({ height = 200, width = "auto" }) => {
    return (
        <Image
            radius="md"
            mx="auto"
            h={height}
            w={width}
            fit="contain"
            alt="logo"
            src={logo || "https://placehold.co/600x400?text=Placeholder"}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
    );
};
