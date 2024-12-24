import { IconFileSymlink } from "@tabler/icons-react";
import { BtnSection } from "../elements/buttons/BtnServices";

export const ProfileBtnService = () => {
    return (
        <BtnSection
            fullWidth={true}
            heigh={60}
            fontSize={16}
            IconSection={IconFileSymlink}
            handleAction={() => console.log("clic")}
        >
            Agregar Actas
        </BtnSection>
    );
};
