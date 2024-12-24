import { Route, Routes } from "react-router-dom";
import { ErrorNotFound } from "../../pages";

const RoutesNotFound = ({ children }) => {
    return (
        <Routes>
            {children}
            <Route path="*" element={<ErrorNotFound />} />
        </Routes>
    );
};

export default RoutesNotFound;
