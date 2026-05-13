import type { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";
import type { SchemaColumn } from "@/src/domain/sql-validator/entities/schema-column";
import type { SchemaTable } from "@/src/domain/sql-validator/entities/schema-table";
import { normalizeIdentifier } from "@/src/domain/sql-validator/utils/normalize-identifier";

// Adapter de infraestructura: implementa el puerto con datos en memoria (MVP).
export class InMemorySchemaRepository implements SchemaRepositoryPort {
  private readonly schema: Record<string, SchemaTable> = {
    usuarios: {
      name: "usuarios",
      columns: [
        {
          name: "id",
          type: "INT",
        },
        {
          name: "nombre",
          type: "VARCHAR",
        },
        {
          name: "edad",
          type: "INT",
        },
        {
          name: "ciudad",
          type: "VARCHAR",
        },
      ],
    },

    productos: {
      name: "productos",
      columns: [
        {
          name: "id",
          type: "INT",
        },
        {
          name: "nombre",
          type: "VARCHAR",
        },
        {
          name: "precio",
          type: "FLOAT",
        },
        {
          name: "categoria",
          type: "VARCHAR",
        },
      ],
    },
  };

  existsTable(tableName: string): boolean {
    const normalizedTableName = normalizeIdentifier(tableName);

    if (!normalizedTableName) {
      return false;
    }

    return Object.hasOwn(this.schema, normalizedTableName);
  }

  existsColumn(tableName: string, columnName: string): boolean {
    const normalizedTableName = normalizeIdentifier(tableName);
    const normalizedColumnName = normalizeIdentifier(columnName);

    if (!normalizedTableName || !normalizedColumnName) {
      return false;
    }

    const table = this.schema[normalizedTableName];

    if (!table) {
      return false;
    }

    return table.columns.some(
      (column) =>
        normalizeIdentifier(column.name) === normalizedColumnName
    );
  }

  findTable(tableName: string): SchemaTable | null {
    const normalizedTableName = normalizeIdentifier(tableName);

    if (!normalizedTableName) {
      return null;
    }

    return this.schema[normalizedTableName] || null;
  }

  findColumn(
    tableName: string,
    columnName: string
  ): SchemaColumn | null {
    const normalizedColumnName = normalizeIdentifier(columnName);

    if (!normalizedColumnName) {
      return null;
    }

    const table = this.findTable(tableName);

    if (!table) {
      return null;
    }

    return (
      table.columns.find(
        (column) =>
          normalizeIdentifier(column.name) === normalizedColumnName
      ) || null
    );
  }
}
