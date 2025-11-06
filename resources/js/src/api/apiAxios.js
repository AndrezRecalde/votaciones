import axios from "axios";
import { getEnv } from "../helpers/getEnv";

const { VITE_APP_URL } = getEnv();

// Crear una instancia de Axios
const apiAxios = axios.create({
    baseURL: VITE_APP_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Variable para controlar si ya se obtuvo el CSRF token
let csrfTokenInitialized = false;

// Función para obtener el token CSRF solo una vez al iniciar
const ensureCsrfToken = async () => {
    if (!csrfTokenInitialized) {
        try {
            await axios.get(`${VITE_APP_URL}/sanctum/csrf-cookie`, {
                withCredentials: true,
            });
            csrfTokenInitialized = true;
        } catch (error) {
            console.error("Error al obtener CSRF token:", error);
        }
    }
};

// Inicializar CSRF token al cargar la aplicación
ensureCsrfToken();

// Interceptor para agregar el token de autorización
apiAxios.interceptors.request.use(
    (config) => {
        // Agregar el token de autorización si existe
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;

        // Manejar errores 401 (No autorizado)
        if (response && response.status === 401) {
            localStorage.clear(); // Limpiar todo el localStorage
            csrfTokenInitialized = false; // Reset del CSRF token
            window.location.href = "/auth/login";
        }

        // Manejar errores 403 (Forbidden - falta de permisos)
        if (response && response.status === 403) {
            console.error(
                "Error 403: No tienes permisos para acceder a este recurso"
            );
        }

        // Manejar otros errores
        if (!response) {
            console.error("Error de red o servidor no disponible");
        }

        return Promise.reject(error);
    }
);

export default apiAxios;
