import { Badge } from "@mantine/core";

export const BadgeElement = ({ children, variant, radius = "md" }) => {
    return (
        <Badge variant={variant} size="lg" radius={radius} color="indigo.7">
            { children }
        </Badge>
    );
};
