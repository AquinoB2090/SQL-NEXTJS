import { ValidationResult } from "@/src/domain/sql-validator/entities/validation-result";
import { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";

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
    const selectPattern = /^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+WHERE\s+.+)?\s*;?$/i;
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
    const columns = rawColumns === "*"
      ? ["*"]
      : rawColumns.split(",").map((c) => c.trim()).filter(Boolean);

    const errors: string[] = [];

    // Fase semantica: valida existencia de tabla/columnas via puerto de esquema.
    if (!schema.existsTable(tableName)) {
      errors.push(`La tabla '${tableName}' no existe.`);
    }

    if (errors.length === 0 && columns[0] !== "*") {
      for (const column of columns) {
        if (!schema.existsColumn(tableName, column)) {
          errors.push(`La columna '${column}' no existe en '${tableName}'.`);
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
