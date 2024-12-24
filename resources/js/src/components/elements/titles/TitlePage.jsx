import { Title } from "@mantine/core";

export const TitlePage = ({ order = 1, ta, children, ...props }) => {
    return (
        <Title ta={ta} order={order} {...props}>
            {children}
        </Title>
    );
};
