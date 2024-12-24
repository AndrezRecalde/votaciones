import "./assets/styles/index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "mantine-react-table/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Suspense } from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/router/AppRouter";

export const App = () => {
    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <Provider store={store}>
                <Suspense fallback={<span>Loading...</span>}>
                    <BrowserRouter>
                        <AppRouter />
                    </BrowserRouter>
                </Suspense>
            </Provider>
        </MantineProvider>
    );
};
