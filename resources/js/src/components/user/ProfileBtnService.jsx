import { IconFileSymlink } from "@tabler/icons-react";
import { BtnSection } from "../elements/buttons/BtnServices";
import { useNavigate } from "react-router-dom";
import {
    HEADER_MENU_CONSULTA,
    PREFIX_ROUTES,
} from "../../routes/router/routes";

export const ProfileBtnService = () => {
    const navigate = useNavigate();
    return (
        <BtnSection
            fullWidth={true}
            height={60}
            fontSize={16}
            IconSection={IconFileSymlink}
            handleAction={() =>
                navigate(
                    `${PREFIX_ROUTES.ELECCIONES}${PREFIX_ROUTES.DIGITACION}/${HEADER_MENU_CONSULTA.DIGITACION_CONSULTA}`
                )
            }
        >
            Agregar Actas
        </BtnSection>
    );
};
