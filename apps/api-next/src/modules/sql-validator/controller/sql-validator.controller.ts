import type { ValidateSqlRequest, ValidateSqlResponse } from "@hex/sql-contracts";
import { ValidateSqlUseCase } from "../application/use-cases/validate-sql.use-case";

export class SqlValidatorController {
  constructor(private readonly validateSqlUseCase: ValidateSqlUseCase) {}

  handle(body: unknown): ValidateSqlResponse {
    const payload = body as Partial<ValidateSqlRequest>;

    if (typeof payload.query !== "string") {
      return {
        valid: false,
        phase: "LEXICAL",
        errors: ["El campo 'query' es obligatorio y debe ser string."],
        warnings: [],
        parsed: { table: null, columns: [] }
      };
    }

    return this.validateSqlUseCase.execute({ query: payload.query });
  }
}
