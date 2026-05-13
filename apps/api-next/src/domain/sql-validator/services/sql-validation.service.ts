import type { ValidationResult } from "@/src/domain/sql-validator/entities/validation-result";
import type { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";
import { normalizeIdentifier } from "@/src/domain/sql-validator/utils/normalize-identifier";

// Domain Service: reglas puras de validacion SQL (sin framework ni IO).
export class SqlValidationService {
  validate(query: string, schema: SchemaRepositoryPort): ValidationResult {
    const trimmed = query.trim();

    if (!trimmed) {
      return {
        valid: false,
        phase: "LEXICAL",
        errors: ["La query esta vacia."],
        warnings: [],
        parsed: { table: null, columns: [] }
      };
    }

    // MVP sintactico: soporta SELECT columnas FROM tabla [WHERE ...]
    const selectPattern =
      /^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+WHERE\s+(.+))?\s*;?$/i;
    const match = trimmed.match(selectPattern);

    if (!match) {
      return {
        valid: false,
        phase: "SYNTACTIC",
        errors: ["Solo se acepta formato: SELECT ... FROM tabla [WHERE ...]."],
        warnings: [],
        parsed: { table: null, columns: [] }
      };
    }

    const rawColumns = match[1].trim();
    const tableName = match[2].trim();
    const whereClause = match[3]?.trim() ?? null;
    const columns = rawColumns === "*"
      ? ["*"]
      : rawColumns.split(",").map((c) => c.trim()).filter(Boolean);

    const errors: string[] = [];

    // Fase semantica: valida existencia de tabla/columnas via metadata del puerto.
    const table = schema.findTable(tableName);

    if (!table) {
      errors.push(`La tabla '${tableName}' no existe.`);
    }

    if (errors.length === 0 && columns[0] !== "*") {
      for (const column of columns) {
        if (!schema.findColumn(tableName, column)) {
          errors.push(`La columna '${column}' no existe en '${tableName}'.`);
        }
      }
    }

    // Paso preparatorio para type-check de WHERE: valida que la columna referenciada exista.
    if (errors.length === 0 && whereClause) {
      const whereColumnMatch = whereClause.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(=|!=|<>|<=|>=|<|>)/
      );

      if (whereColumnMatch) {
        const whereColumn = normalizeIdentifier(whereColumnMatch[1]);

        if (whereColumn && !schema.findColumn(tableName, whereColumn)) {
          errors.push(
            `La columna '${whereColumnMatch[1]}' no existe en '${tableName}' para la clausula WHERE.`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      phase: "SEMANTIC",
      errors,
      warnings: [],
      parsed: {
        table: tableName,
        columns
      }
    };
  }
}
