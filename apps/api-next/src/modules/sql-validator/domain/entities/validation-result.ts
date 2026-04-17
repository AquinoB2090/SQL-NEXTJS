import { ParsedQuery } from "./parsed-query";

export interface ValidationResult {
  valid: boolean;
  phase: "LEXICAL" | "SYNTACTIC" | "SEMANTIC";
  errors: string[];
  warnings: string[];
  parsed: ParsedQuery;
}
