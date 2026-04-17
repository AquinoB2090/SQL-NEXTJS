import type { ValidateSqlResponse } from "@hex/sql-contracts";
import { ValidateSqlInput } from "../dto/validate-sql.dto";
import { SqlValidationService } from "../../domain/services/sql-validation.service";
import { SchemaRepositoryPort } from "../../domain/ports/schema-repository.port";

export class ValidateSqlUseCase {
  constructor(
    private readonly validationService: SqlValidationService,
    private readonly schemaRepository: SchemaRepositoryPort
  ) {}

  execute(input: ValidateSqlInput): ValidateSqlResponse {
    const result = this.validationService.validate(input.query, this.schemaRepository);

    return {
      valid: result.valid,
      phase: result.phase,
      errors: result.errors,
      warnings: result.warnings,
      parsed: result.parsed
    };
  }
}
