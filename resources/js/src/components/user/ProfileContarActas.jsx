import { Table } from '@mantine/core'
import { useUsuarioStore } from '../../hooks';

export const ProfileContarActas = () => {
    const { numero_actas } = useUsuarioStore();

    const rows = numero_actas?.map((numero, index) => (
        <Table.Tr key={index}>
          <Table.Td>{numero?.total_ingresadas_add }</Table.Td>
          <Table.Td>{numero?.total_ingresadas_update}</Table.Td>
        </Table.Tr>
      ));

  return (
    <Table striped withTableBorder withColumnBorders>
      <Table.Thead>
          <Table.Tr>
            <Table.Th>No. Actas Ingresadas</Table.Th>
            <Table.Th>No. Actas Actualizadas</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
