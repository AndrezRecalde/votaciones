import { Button, rem } from "@mantine/core";
import { useAuthStore } from "../../hooks";

export const UserBtnMobile = () => {
    const { startLogout } = useAuthStore();
    return (
        <Button
            variant="filled"
            color="red.7"
            onClick={startLogout}
            fullWidth
            styles={{
                root: {
                    "--button-height": rem(30),
                },
                inner: {
                    fontSize: 12,
                },
            }}
        >
            Cerrar Sesión
        </Button>
    );
};
