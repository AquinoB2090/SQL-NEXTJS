import assert from "node:assert/strict";
import { SqlValidationService } from "@/src/domain/sql-validator/services/sql-validation.service";
import { InMemorySchemaRepository } from "@/src/infrastructure/sql-validator/repositories/in-memory-schema.repository";

export function runSqlValidationServiceTests(): void {
  const service = new SqlValidationService();
  const schemaRepository = new InMemorySchemaRepository();

  const caseInsensitiveSelectResult = service.validate(
    "SELECT NOMBRE, eDaD FROM UsUaRiOs;",
    schemaRepository
  );

  assert.equal(
    caseInsensitiveSelectResult.valid,
    true,
    "SqlValidationService debe aceptar SELECT case-insensitive en tabla y columnas"
  );
  assert.deepEqual(
    caseInsensitiveSelectResult.errors,
    [],
    "SqlValidationService no debe devolver errores para consulta valida"
  );

  const caseInsensitiveWhereResult = service.validate(
    "SELECT nombre FROM usuarios WHERE EdAd >= 18;",
    schemaRepository
  );

  assert.equal(
    caseInsensitiveWhereResult.valid,
    true,
    "SqlValidationService debe validar columna WHERE case-insensitive"
  );
  assert.deepEqual(
    caseInsensitiveWhereResult.errors,
    [],
    "SqlValidationService no debe devolver errores cuando WHERE usa columna existente"
  );

  const invalidWhereResult = service.validate(
    "SELECT nombre FROM usuarios WHERE salario > 1000;",
    schemaRepository
  );

  assert.equal(
    invalidWhereResult.valid,
    false,
    "SqlValidationService debe invalidar WHERE con columna inexistente"
  );
  assert.equal(
    invalidWhereResult.phase,
    "SEMANTIC",
    "SqlValidationService debe reportar fase semantica para error de columna WHERE"
  );
  assert.equal(
    invalidWhereResult.errors.length,
    1,
    "SqlValidationService debe reportar un error para columna WHERE inexistente"
  );
  assert.equal(
    invalidWhereResult.errors[0],
    "La columna 'salario' no existe en 'usuarios' para la clausula WHERE.",
    "SqlValidationService debe retornar mensaje esperado para columna WHERE inexistente"
  );
}
