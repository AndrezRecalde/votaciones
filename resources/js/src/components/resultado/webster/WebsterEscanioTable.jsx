import { useEffect, useState } from "react";
import { useResultadoStore } from "../../../hooks";
import { Table } from "@mantine/core";
import { TitlePage } from "../../elements/titles/TitlePage";

export const WebsterEscanioTable = () => {
  // Resultados iniciales
  const { resultadoCandidatos } = useResultadoStore();

  const [asignacion, setAsignacion] = useState([]);

  // Función para calcular los escaños
  const calcularWebster = (resultadoCandidatos, totalEscaños) => {
    const divisores = [1, 3, 5, 7, 9]; // Divisores de Webster
    let tablaWebster = [];

    // Generar tabla inicial con divisores
    resultadoCandidatos.forEach((partido) => {
      divisores.forEach((divisor) => {
        tablaWebster.push({
          nombre_partido: partido.nombre_organizacion,
          cociente: partido.total_votos / divisor,
          total: partido.total_votos,
          color: partido.color,
        });
      });
    });

    // Ordenar la tabla de mayor a menor cociente
    tablaWebster.sort((a, b) => b.cociente - a.cociente);

    // Seleccionar los partidos con los 5 cocientes más altos
    const escañosSeleccionados = tablaWebster.slice(0, totalEscaños);

    // Contar cuántos escaños recibe cada partido
    const conteoEscaños = {};
    escañosSeleccionados.forEach((escaño) => {
      if (!conteoEscaños[escaño.nombre_partido]) {
        conteoEscaños[escaño.nombre_partido] = 0;
      }
      conteoEscaños[escaño.nombre_partido]++;
    });

    // Retornar el resultado en formato legible
    return resultadoCandidatos.map((partido) => ({
      nombre_partido: partido.nombre_organizacion,
      escaños: conteoEscaños[partido.nombre_organizacion] || 0,
      total: partido.total_votos,
      color: partido.color,
    }));
  };

  // Calcular los escaños al cargar el componente
  const calcular = () => {
    const resultado = calcularWebster(resultadoCandidatos, 5); // Total de escaños: 5
    setAsignacion(resultado);
  };

  useEffect(() => {
    calcular();

  }, [resultadoCandidatos])


  return (
    <div>
      <TitlePage order={3}>Distribución de Escaños - Método de Webster</TitlePage>
      {/* <button onClick={calcular}>Calcular Escaños</button> */}
      <Table withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Partido</Table.Th>
            <Table.Th>Total Votos</Table.Th>
            <Table.Th>Escaños</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {asignacion.map((partido) => (
            <Table.Tr key={partido.nombre_partido}>
              <Table.Td>{partido.nombre_partido}</Table.Td>
              <Table.Td>{partido.total}</Table.Td>
              <Table.Td style={{ background: partido.color }}>{partido.escaños}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};


