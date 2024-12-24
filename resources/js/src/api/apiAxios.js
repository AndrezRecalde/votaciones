import axios from "axios";
import { getEnv } from "../helpers/getEnv";

const { VITE_APP_URL } = getEnv();

// Crear una instancia de Axios
const apiAxios = axios.create({
    baseURL: VITE_APP_URL,
    withCredentials: true, // Asegúrate de que Axios envíe las cookies con cada solicitud
});

// Interceptor para agregar los encabezados necesarios
apiAxios.interceptors.request.use(async (config) => {
    // Verificar si ya se ha obtenido el token CSRF
    if (!document.cookie.includes('XSRF-TOKEN')) {
        await axios.get(`${VITE_APP_URL}/sanctum/csrf-cookie`, {
            withCredentials: true, // Esto es importante para Sanctum
        });
    }

    // Agregar encabezado de autorización si existe el token en localStorage
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Agregar cualquier otro encabezado necesario
    config.headers.Accept = "application/json";

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores de respuesta
apiAxios.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, devolver los datos normalmente
        return response;
    },
    async (error) => {
        // Si recibimos un error 401 (No autorizado)
        if (error.response && error.response.status === 401) {
            // Aquí podrías redirigir al usuario al login, limpiar el token o realizar otras acciones
            console.log("Error 401: No autorizado, redirigiendo al login...");
            localStorage.removeItem("auth_token"); // Limpiar el token almacenado

            // Redirigir a la página de inicio de sesión
            window.location.href = window.location.href;
        }

        // Si el error es otro, simplemente lo rechazas
        return Promise.reject(error);
    }
);

export default apiAxios;
