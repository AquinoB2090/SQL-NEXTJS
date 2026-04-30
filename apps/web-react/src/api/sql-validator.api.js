import { VALIDATE_SQL_ENDPOINT } from "@hex/sql-contracts";
const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
// Gateway frontend: unico punto para consumir la API de validacion SQL.
export async function validateSql(query) {
    const response = await fetch(`${baseUrl}${VALIDATE_SQL_ENDPOINT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });
    const payload = (await response.json());
    // El contrato compartido retorna errores funcionales con shape tipado.
    if (!payload.ok) {
        throw new Error(payload.error.message);
    }
    if (!response.ok) {
        throw new Error("Error al validar query.");
    }
    return payload.data;
}
