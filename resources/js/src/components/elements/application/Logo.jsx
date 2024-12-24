import { Image } from '@mantine/core';
import logo from "../../../assets/images/LogoMediano.png";


export const Logo = ({ height = 200, width = "auto", mx="auto" }) => {
    return (
        <Image
            radius="md"
            mx={mx}
            h={height}
            w={width}
            fit="contain"
            alt="logo"
            src={logo}
        />
    );
};
