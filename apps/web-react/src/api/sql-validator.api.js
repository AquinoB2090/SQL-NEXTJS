const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
export async function validateSql(query) {
    const response = await fetch(`${baseUrl}/api/sql/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });
    const payload = (await response.json());
    if (!response.ok) {
        throw new Error(payload.message ?? "Error al validar query");
    }
    return payload;
}
