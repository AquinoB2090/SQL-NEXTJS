import { NextRequest, NextResponse } from "next/server";
import { createSqlValidatorController } from "@/src/infrastructure/composition/sql-validator.module";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Body JSON invalido. Formato esperado: { \"query\": \"...\" }" },
      { status: 400 }
    );
  }

  const controller = createSqlValidatorController();
  const result = controller.handle(body);

  return NextResponse.json(result, { status: 200 });
}
