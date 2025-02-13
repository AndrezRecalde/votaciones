import { Box, Select, SimpleGrid, Stack } from "@mantine/core";
import { useDignidadStore, useResultadoStore } from "../../../hooks";
import { BtnSubmit } from "../../../components";
import { IconSearch } from "@tabler/icons-react";
import { useEffect } from "react";

export const MapBusquedaForm = ({ form }) => {
    const { dignidad_id } = form.values;
    const { dignidades } = useDignidadStore();
    const {
        startLoadResultadosCandidatosGuess,
        startLoadResultadosForMap,
        startLoadTotalDeVotosGuess,

        startLoadTotalActasIngresadasMapa,
        startLoadTotalJuntasMapa,

        startClearResultados
    } = useResultadoStore();

    const handleSubmit =  (e) => {
        e.preventDefault();
        //console.log("submit");
        startLoadTotalDeVotosGuess({
            dignidad_id,
            provincia_id: 8,
        });
        startLoadResultadosCandidatosGuess({
            dignidad_id,
            privinicia_id: 8,
        });
        startLoadResultadosForMap(dignidad_id);

        startLoadTotalActasIngresadasMapa({
            dignidad_id,
            provincia_id: 8,
        });
        startLoadTotalJuntasMapa({
            dignidad_id,
            provincia_id: 8,
        });
    };

    useEffect(() => {
        //startClearResultados();

      return () => {
        startClearResultados();
      }
    }, [dignidad_id])


    return (
        <Box
            component="form"
            mx={15}
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
            mb={20}
        >
            <Stack>
                <SimpleGrid cols={{ base: 1, xs: 1, sm: 1, md: 1, lg: 1 }}>
                    <Select
                        label="Dignidad"
                        placeholder="Seleccione una Dignidad"
                        searchable
                        clearable
                        nothingFoundMessage="No options"
                        {...form.getInputProps("dignidad_id")}
                        data={dignidades.map((dignidad) => {
                            return {
                                label: dignidad.nombre_dignidad,
                                value: dignidad.id.toString(),
                            };
                        })}
                    />
                </SimpleGrid>
                <BtnSubmit IconSection={IconSearch}>
                    Filtrar Resultados
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
