import { NextRequest, NextResponse } from "next/server";
import type { ValidateSqlApiResponse } from "@hex/sql-contracts";
import { createSqlValidatorController } from "@/src/infrastructure/composition/sql-validator.module";

// Adapter HTTP (Next.js): traduce request/response web al flujo de la app.
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const payload: ValidateSqlApiResponse = {
      ok: false,
      error: {
        code: "INVALID_JSON_BODY",
        message: "Body JSON invalido. Formato esperado: { \"query\": \"...\" }"
      }
    };

    return NextResponse.json(payload, { status: 400 });
  }

  const controller = createSqlValidatorController();
  // El controlador pertenece a infraestructura y delega el trabajo al caso de uso.
  const result = controller.handle(body);

  if (!result.ok) {
    return NextResponse.json(
      result,
      { status: 400 }
    );
  }

  return NextResponse.json(result, { status: 200 });
}
