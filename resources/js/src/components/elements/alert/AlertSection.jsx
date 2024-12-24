import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export const AlertSection = ({ variant, color, icon:Icon = IconInfoCircle, title, children }) => {
    return (
        <Alert
            variant={variant}
            color={color}
            title={title}
            icon={<Icon />}
            mt={10}
            mb={20}
        >
            {children}
        </Alert>
    );
};
