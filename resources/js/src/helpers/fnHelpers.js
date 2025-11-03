export function capitalizarCadaPalabra(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(" ");
}

export const convertToString = (value) =>
    value !== null && value !== undefined ? value.toString() : null;

export const isValid = (value) => value !== null && value !== undefined;
