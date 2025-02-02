import axios from "axios";
import { getEnv } from "../helpers/getEnv";

const { VITE_APP_URL } = getEnv();

// Crear una instancia de Axios
const apiAxios = axios.create({
    baseURL: VITE_APP_URL,
    withCredentials: true, // Envía cookies en cada solicitud
    headers: {
        Accept: "application/json", // Encabezado común para todas las solicitudes
    },
});

// Función para obtener el token CSRF si no está presente
const ensureCsrfToken = async () => {
    if (!document.cookie.includes("XSRF-TOKEN")) {
        await axios.get(`${VITE_APP_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
        });
    }
};

// Interceptor para agregar el token de autorización y asegurar el token CSRF
apiAxios.interceptors.request.use(async (config) => {
    await ensureCsrfToken(); // Asegura que el token CSRF esté presente

    // Agregar el token de autorización si existe
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores de respuesta
apiAxios.interceptors.response.use(
    (response) => response, // Devuelve la respuesta directamente si es exitosa
    async (error) => {
        const { response } = error;

        // Manejar errores 401 (No autorizado)
        if (response && response.status === 401) {
            console.log("Error 401: No autorizado, redirigiendo al login...");
            localStorage.removeItem("auth_token"); // Limpiar el token almacenado
            window.location.href = "/auth/login"; // Redirigir a la página de inicio de sesión
        }

        // Manejar otros errores
        if (!response) {
            console.error("Error de red o servidor no disponible");
        }

        return Promise.reject(error);
    }
);

export default apiAxios;
