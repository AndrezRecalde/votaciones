import { Badge } from "@mantine/core";

export const BadgeElement = ({ children, variant, size = "lg", radius = "md" }) => {
    return (
        <Badge variant={variant} size={size} radius={radius} color="indigo.7">
            { children }
        </Badge>
    );
};
