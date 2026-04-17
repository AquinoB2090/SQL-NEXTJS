export type ValidationPhase = "LEXICAL" | "SYNTACTIC" | "SEMANTIC";

export interface ValidateSqlRequest {
  query: string;
}

export interface ValidateSqlResponse {
  valid: boolean;
  phase: ValidationPhase;
  errors: string[];
  warnings: string[];
  parsed: {
    table: string | null;
    columns: string[];
  };
}
