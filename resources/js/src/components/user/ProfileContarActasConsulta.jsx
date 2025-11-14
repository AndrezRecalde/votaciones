import { Table } from "@mantine/core";
import { useEscrutinioConsultaStore } from "../../hooks";

export const ProfileContarActasConsulta = () => {
    const { resumenUsuario } = useEscrutinioConsultaStore();
    return (
        <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>No. Actas Ingresadas</Table.Th>
                    <Table.Th>No. Actas Actualizadas</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>{resumenUsuario?.total_ingresadas}</Table.Td>
                    <Table.Td>{resumenUsuario?.total_actualizadas}</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
