import { IconFileSymlink } from "@tabler/icons-react";
import { BtnSection } from "../elements/buttons/BtnServices";
import { useNavigate } from "react-router-dom";
import { HEADER_MENU, PREFIX_ROUTES } from "../../routes/router/routes";

export const ProfileBtnService = () => {
    const navigate = useNavigate();
    return (
        <BtnSection
            fullWidth={true}
            heigh={60}
            fontSize={16}
            IconSection={IconFileSymlink}
            handleAction={() => navigate(`${PREFIX_ROUTES.DIGITADOR}/${HEADER_MENU.DIGITACION}`)}
        >
            Agregar Actas
        </BtnSection>
    );
};
