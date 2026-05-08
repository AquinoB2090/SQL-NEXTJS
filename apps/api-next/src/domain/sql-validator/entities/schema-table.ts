import { SchemaColumn } from './schema-column';

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}