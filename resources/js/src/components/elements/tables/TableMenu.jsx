import { Menu, rem } from "@mantine/core";
import { IconEditCircle, IconRestore, IconTrash } from "@tabler/icons-react";

export const TableMenu = ({
    row,
    handleEdit,
    handleDelete,
    handleResetPassword = null,
}) => {
    return (
        <>
            <Menu.Item
                leftSection={
                    <IconEditCircle
                        style={{ width: rem(15), height: rem(15) }}
                    />
                }
                onClick={() => handleEdit(row.original)}
            >
                Editar
            </Menu.Item>
            <Menu.Item
                leftSection={
                    <IconTrash style={{ width: rem(15), height: rem(15) }} />
                }
                onClick={() => handleDelete(row.original)}
            >
                Eliminar
            </Menu.Item>
            {handleResetPassword !== null ? (
                <Menu.Item
                    leftSection={
                        <IconRestore
                            style={{ width: rem(15), height: rem(15) }}
                        />
                    }
                    onClick={() => handleResetPassword(row.original)}
                >
                    Resetear Contraseña
                </Menu.Item>
            ) : null}
        </>
    );
};
