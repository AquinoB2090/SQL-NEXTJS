import type { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";
import { InMemorySchemaRepository } from "@/src/infrastructure/sql-validator/repositories/in-memory-schema.repository";

export type SchemaSource = "in-memory";

const DEFAULT_SCHEMA_SOURCE_BY_ENV: Record<string, SchemaSource> = {
  development: "in-memory",
  test: "in-memory",
  production: "in-memory",
};

export function resolveSchemaSource(
  env: NodeJS.ProcessEnv = process.env
): SchemaSource {
  const explicitSource = env.SCHEMA_SOURCE?.trim().toLowerCase();

  if (explicitSource) {
    if (explicitSource === "in-memory") {
      return "in-memory";
    }

    throw new Error(
      `SCHEMA_SOURCE '${env.SCHEMA_SOURCE}' no es valido. Valores permitidos: in-memory.`
    );
  }

  const currentEnvironment = env.NODE_ENV?.trim().toLowerCase() ?? "development";

  return DEFAULT_SCHEMA_SOURCE_BY_ENV[currentEnvironment] ?? "in-memory";
}

export function createSchemaRepository(
  env: NodeJS.ProcessEnv = process.env
): SchemaRepositoryPort {
  const schemaSource = resolveSchemaSource(env);

  switch (schemaSource) {
    case "in-memory":
      return new InMemorySchemaRepository();
    default:
      throw new Error(`SCHEMA_SOURCE '${schemaSource}' no esta soportado.`);
  }
}
