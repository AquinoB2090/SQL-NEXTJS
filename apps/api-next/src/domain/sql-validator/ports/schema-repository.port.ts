// Port de dominio: define lo que el negocio necesita de un repositorio de esquema.
export interface SchemaRepositoryPort {
  existsTable(tableName: string): boolean;
  existsColumn(tableName: string, columnName: string): boolean;
}
