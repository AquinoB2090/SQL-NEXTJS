import { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";

export class InMemorySchemaRepository implements SchemaRepositoryPort {
  private readonly schema: Record<string, string[]> = {
    usuarios: ["id", "nombre", "edad", "ciudad"],
    productos: ["id", "nombre", "precio", "categoria"]
  };

  existsTable(tableName: string): boolean {
    return Object.hasOwn(this.schema, tableName.toLowerCase());
  }

  existsColumn(tableName: string, columnName: string): boolean {
    const columns = this.schema[tableName.toLowerCase()];
    if (!columns) {
      return false;
    }

    return columns.some((c) => c.toLowerCase() === columnName.toLowerCase());
  }
}
