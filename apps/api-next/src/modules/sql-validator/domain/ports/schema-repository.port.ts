export interface SchemaRepositoryPort {
  existsTable(tableName: string): boolean;
  existsColumn(tableName: string, columnName: string): boolean;
}
