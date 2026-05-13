import assert from "node:assert/strict";
import {
  createSchemaRepository,
  resolveSchemaSource,
} from "@/src/infrastructure/composition/schema-repository.factory";
import { InMemorySchemaRepository } from "@/src/infrastructure/sql-validator/repositories/in-memory-schema.repository";

export function runSchemaRepositoryFactoryTests(): void {
  const explicitSource = resolveSchemaSource({
    NODE_ENV: "production",
    SCHEMA_SOURCE: "in-memory",
  });

  assert.equal(
    explicitSource,
    "in-memory",
    "Factory debe usar SCHEMA_SOURCE explicito"
  );

  const defaultSource = resolveSchemaSource({
    NODE_ENV: "test",
  });

  assert.equal(
    defaultSource,
    "in-memory",
    "Factory debe usar default por ambiente cuando no hay SCHEMA_SOURCE"
  );

  assert.throws(
    () =>
      resolveSchemaSource({
        NODE_ENV: "development",
        SCHEMA_SOURCE: "unsupported-source",
      }),
    "Factory debe fallar con SCHEMA_SOURCE invalido"
  );

  const repository = createSchemaRepository({
    NODE_ENV: "development",
    SCHEMA_SOURCE: "in-memory",
  });

  assert.ok(
    repository instanceof InMemorySchemaRepository,
    "Factory debe crear InMemorySchemaRepository para in-memory"
  );
}
