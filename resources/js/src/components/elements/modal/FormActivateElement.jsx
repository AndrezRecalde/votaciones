import { useEffect } from "react";
import { Box, Select, Stack } from "@mantine/core";
import { BtnSubmit } from "../../../components";

export const FormActivateElement = ({ form, startAction, modalAction, activateElement}) => {

    useEffect(() => {
      if (activateElement !== null) {
        form.setValues({
            ...activateElement,
            activo: activateElement.activo.toString()
        });
        return;
      }

    }, [activateElement]);

    const handleSubmit = (e) => {
        e.preventDefault();
        startAction(form.getValues());
        modalAction(false);
        form.reset();
    }


    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack>
                <Select
                    withAsterisk
                    required
                    data={[
                        { label: "Si", value: "1" },
                        { label: "No", value: "0" },
                    ]}
                    placeholder="¿Desea activar el elemento?"
                    label="Activar"
                    {...form.getInputProps("activo")}
                />
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
