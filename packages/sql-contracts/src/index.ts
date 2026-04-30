export const VALIDATE_SQL_ENDPOINT = "/api/sql/validate" as const;

export type ValidationPhase = "LEXICAL" | "SYNTACTIC" | "SEMANTIC";

export interface ParsedSqlQuery {
  table: string | null;
  columns: string[];
}

export interface SqlValidationReport {
  valid: boolean;
  phase: ValidationPhase;
  errors: string[];
  warnings: string[];
  parsed: ParsedSqlQuery;
}

export interface ValidateSqlRequest {
  query: string;
}

export type ValidateSqlResponse = SqlValidationReport;

// Catalogo de errores esperados para este endpoint.
export type ValidateSqlErrorCode = "INVALID_JSON_BODY" | "INVALID_QUERY_PAYLOAD";

export interface ApiError<E extends string = string> {
  code: E;
  message: string;
  details?: string[];
}

// Envelope estandar para que FE/BE compartan un mismo contrato de exito/error.
export type ApiResponse<T, E extends string = string> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError<E> };

export type ValidateSqlApiResponse = ApiResponse<
  ValidateSqlResponse,
  ValidateSqlErrorCode
>;
