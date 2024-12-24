import { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { TextSection, TitlePage } from "../../../components";
import { useResultadoStore } from "../../../hooks";

const ths = (
    <Table.Tr>
        <Table.Th>Lista</Table.Th>
        <Table.Th>Organización</Table.Th>
        <Table.Th>Total Votos</Table.Th>
        <Table.Th>1</Table.Th>
        <Table.Th>3</Table.Th>
        <Table.Th>5</Table.Th>
        <Table.Th>7</Table.Th>
        <Table.Th>Porcentaje</Table.Th>
    </Table.Tr>
);

export const WebsterTable = () => {
    const [valores, setValores] = useState([]);
    const { resultadoCandidatos, totalDeVotos } = useResultadoStore();

    useEffect(() => {
        funTotales();

        return () => {
            setValores([]);
        };
    }, [resultadoCandidatos]);

    let funTotales = () => {
        resultadoCandidatos?.some((candidato) => {
            let div1 = candidato.total_votos;
            let div3 = parseFloat(candidato.total_votos / 3).toFixed(2);
            let div5 = parseFloat(candidato.total_votos / 5).toFixed(2);
            let div7 = parseFloat(candidato.total_votos / 7).toFixed(2);

            setValores((prev) => [
                ...prev,
                parseFloat(div1),
                parseFloat(div3),
                parseFloat(div5),
                parseFloat(div7),
            ]);
        });
    };

    const rows = resultadoCandidatos?.map((candidato) => {
        let total_1 = parseFloat(candidato.total_votos / 1);
        let total_3 = parseFloat(candidato.total_votos / 3).toFixed(2);
        let total_5 = parseFloat(candidato.total_votos / 5).toFixed(2);
        let total_7 = parseFloat(candidato.total_votos / 7).toFixed(2);

        return (
            <Table.Tr key={candidato.numero_organizacion}>
                <Table.Td>
                    {candidato.numero_organizacion + " " + candidato.sigla}
                </Table.Td>
                <Table.Td>{candidato.nombre_candidato}</Table.Td>
                <Table.Td>
                    <TextSection fz={18} fw={700} fs="italic">
                        {candidato.total_votos}
                    </TextSection>
                </Table.Td>
                <Table.Td
                    style={
                        valores
                            .sort((a, b) => b - a)
                            .slice(0, 5)
                            .includes(parseFloat(total_1))
                            ? {
                                  fontWeight: "bold",
                                  color: "black",
                                  background: candidato.color,
                                  padding: "20px 30px", // Para dar espacio dentro del TD
                              }
                            : {}
                    }
                >
                    {total_1}
                </Table.Td>
                <Table.Td
                    style={
                        valores
                            .sort((a, b) => b - a)
                            .slice(0, 5)
                            .includes(parseFloat(total_3))
                            ? {
                                  fontWeight: "bold",
                                  color: "black",
                                  background: candidato.color,
                                  padding: "20px 30px", // Para dar espacio dentro del TD
                              }
                            : {}
                    }
                >
                    {total_3}
                </Table.Td>
                <Table.Td
                    style={
                        valores
                            .sort((a, b) => b - a)
                            .slice(0, 5)
                            .includes(parseFloat(total_5))
                            ? {
                                  fontWeight: "bold",
                                  color: "black",
                                  background: candidato.color,
                                  padding: "20px 30px", // Para dar espacio dentro del TD
                              }
                            : {}
                    }
                >
                    {total_5}
                </Table.Td>
                <Table.Td
                    style={
                        valores
                            .sort((a, b) => b - a)
                            .slice(0, 5)
                            .includes(parseFloat(total_7))
                            ? {
                                  fontWeight: "bold",
                                  color: "black",
                                  background: candidato.color,
                                  padding: "20px 30px", // Para dar espacio dentro del TD
                              }
                            : {}
                    }
                >
                    {total_7}
                </Table.Td>
                <Table.Td>
                    <TextSection fz={18} fw={700} fs="italic">
                        {(
                            (candidato.total_votos * 100) /
                            totalDeVotos.total_votos_validos
                        ).toFixed(2)}{" "}
                        %
                    </TextSection>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Table
            mt="md"
            mb="md"
            verticalSpacing="sm"
            withTableBorder
            withColumnBorders
            captionSide="top"
        >
            <caption>
                <TitlePage order={3} ta="center" mb="md">
                    Resultados Webster
                </TitlePage>
            </caption>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};
