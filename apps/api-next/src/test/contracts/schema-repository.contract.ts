import assert from "node:assert/strict";
import type { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";

interface SchemaRepositoryContractSuiteOptions {
  implementationName: string;
  createRepository: () => SchemaRepositoryPort;
}

export function runSchemaRepositoryContractSuite({
  implementationName,
  createRepository,
}: SchemaRepositoryContractSuiteOptions): void {
  const repository = createRepository();

  assert.equal(
    repository.existsTable("usuarios"),
    true,
    `[${implementationName}] debe resolver tabla existente`
  );
  assert.equal(
    repository.existsTable("tabla_inexistente"),
    false,
    `[${implementationName}] debe rechazar tabla inexistente`
  );
  assert.equal(
    repository.findTable("usuarios")?.name,
    "usuarios",
    `[${implementationName}] findTable debe devolver metadata de tabla`
  );
  assert.equal(
    repository.findTable("tabla_inexistente"),
    null,
    `[${implementationName}] findTable debe devolver null para inexistente`
  );

  assert.equal(
    repository.existsColumn("usuarios", "nombre"),
    true,
    `[${implementationName}] debe resolver columna existente`
  );
  assert.equal(
    repository.existsColumn("usuarios", "columna_x"),
    false,
    `[${implementationName}] debe rechazar columna inexistente`
  );
  assert.equal(
    repository.findColumn("usuarios", "nombre")?.name,
    "nombre",
    `[${implementationName}] findColumn debe devolver metadata de columna`
  );
  assert.equal(
    repository.findColumn("usuarios", "columna_x"),
    null,
    `[${implementationName}] findColumn debe devolver null para inexistente`
  );

  assert.equal(
    repository.existsTable("USUARIOS"),
    true,
    `[${implementationName}] debe ser case-insensitive (USUARIOS)`
  );
  assert.equal(
    repository.existsTable("Usuarios"),
    true,
    `[${implementationName}] debe ser case-insensitive (Usuarios)`
  );
  assert.equal(
    repository.existsTable("uSuArIoS"),
    true,
    `[${implementationName}] debe ser case-insensitive (uSuArIoS)`
  );

  assert.equal(
    repository.existsColumn("usuarios", "NOMBRE"),
    true,
    `[${implementationName}] columna debe ser case-insensitive (NOMBRE)`
  );
  assert.equal(
    repository.existsColumn("usuarios", "Nombre"),
    true,
    `[${implementationName}] columna debe ser case-insensitive (Nombre)`
  );
  assert.equal(
    repository.existsColumn("usuarios", "nOmBrE"),
    true,
    `[${implementationName}] columna debe ser case-insensitive (nOmBrE)`
  );

  assert.equal(
    repository.existsTable("  usuarios  "),
    true,
    `[${implementationName}] debe normalizar espacios en tabla`
  );
  assert.equal(
    repository.existsColumn("  usuarios  ", "  nombre  "),
    true,
    `[${implementationName}] debe normalizar espacios en columna`
  );

  assert.equal(
    repository.existsTable(""),
    false,
    `[${implementationName}] tabla vacia debe ser invalida`
  );
  assert.equal(
    repository.existsColumn("usuarios", ""),
    false,
    `[${implementationName}] columna vacia debe ser invalida`
  );
  assert.equal(
    repository.findTable("   "),
    null,
    `[${implementationName}] findTable vacio debe devolver null`
  );
  assert.equal(
    repository.findColumn("usuarios", "   "),
    null,
    `[${implementationName}] findColumn vacio debe devolver null`
  );

  const table = repository.findTable("usuarios");
  const column = repository.findColumn("usuarios", "edad");

  assert.ok(
    table,
    `[${implementationName}] debe exponer metadata de tabla`
  );
  assert.ok(
    column,
    `[${implementationName}] debe exponer metadata de columna`
  );
  assert.equal(
    table.columns.length > 0,
    true,
    `[${implementationName}] tabla debe tener columnas`
  );
  assert.equal(
    column.type,
    "INT",
    `[${implementationName}] debe exponer tipo de columna`
  );

  assert.equal(
    repository.findColumn("tabla_inexistente", "nombre"),
    null,
    `[${implementationName}] columna en tabla inexistente debe ser null`
  );
  assert.equal(
    repository.existsColumn("tabla_inexistente", "nombre"),
    false,
    `[${implementationName}] existsColumn debe ser false en tabla inexistente`
  );
}
