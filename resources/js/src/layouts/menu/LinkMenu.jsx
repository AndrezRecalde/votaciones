import { Box } from "@mantine/core";
import { Link } from "react-router-dom";

export const LinkMenu = ({ title, handleNavigation, classes, toggleDrawer }) => {
    return (
        <Link
            className={classes.link}
            to={handleNavigation}
            onClick={() => {
                toggleDrawer(false);
            }}
        >
            <Box component="span" mr={5}>
                {title}
            </Box>
        </Link>
    );
};
