import { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";
import { SchemaColumn } from "@/src/domain/sql-validator/entities/schema-column";
import { SchemaTable } from "@/src/domain/sql-validator/entities/schema-table";

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
    return Object.hasOwn(this.schema, tableName.toLowerCase());
  }

  existsColumn(tableName: string, columnName: string): boolean {
    const table = this.schema[tableName.toLowerCase()];

    if (!table) {
      return false;
    }

    return table.columns.some(
      (column) =>
        column.name.toLowerCase() === columnName.toLowerCase()
    );
  }

  findTable(tableName: string): SchemaTable | null {
    return this.schema[tableName.toLowerCase()] || null;
  }

  findColumn(
    tableName: string,
    columnName: string
  ): SchemaColumn | null {
    const table = this.findTable(tableName);

    if (!table) {
      return null;
    }

    return (
      table.columns.find(
        (column) =>
          column.name.toLowerCase() ===
          columnName.toLowerCase()
      ) || null
    );
  };
}