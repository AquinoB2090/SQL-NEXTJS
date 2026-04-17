import type { ValidateSqlResponse } from "@hex/sql-contracts";

const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export async function validateSql(query: string): Promise<ValidateSqlResponse> {
  const response = await fetch(`${baseUrl}/api/sql/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const payload = (await response.json()) as ValidateSqlResponse | { message?: string };

  if (!response.ok) {
    throw new Error((payload as { message?: string }).message ?? "Error al validar query");
  }

  return payload as ValidateSqlResponse;
}
