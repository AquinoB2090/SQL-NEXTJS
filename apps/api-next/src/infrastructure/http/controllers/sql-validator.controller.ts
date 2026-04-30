import type {
  ValidateSqlApiResponse,
  ValidateSqlRequest
} from "@hex/sql-contracts";
import { ValidateSqlUseCase } from "@/src/application/sql-validator/use-cases/validate-sql.use-case";

export class SqlValidatorController {
  constructor(private readonly validateSqlUseCase: ValidateSqlUseCase) {}

  // Controller hexagonal: valida formato de entrada y llama a application.
  handle(body: unknown): ValidateSqlApiResponse {
    const payload = body as Partial<ValidateSqlRequest>;

    if (typeof payload.query !== "string") {
      return {
        ok: false,
        error: {
          code: "INVALID_QUERY_PAYLOAD",
          message: "El campo 'query' es obligatorio y debe ser string."
        }
      };
    }

    return {
      ok: true,
      // El caso de uso ya devuelve un DTO orientado al contrato compartido.
      data: this.validateSqlUseCase.execute({ query: payload.query })
    };
  }
}
