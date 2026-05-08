import { SchemaColumn } from "../entities/schema-column";
import { SchemaTable } from "../entities/schema-table";

// Port de dominio: define lo que el negocio necesita de un repositorio de esquema.
export interface SchemaRepositoryPort {
  existsTable(tableName: string): boolean;

  existsColumn(
    tableName: string,
    columnName: string
  ): boolean;

  findTable(tableName: string): SchemaTable | null;

  findColumn(
    tableName: string,
    columnName: string
  ): SchemaColumn | null;
}