import type { ValidateSqlResponse } from "@hex/sql-contracts";
import { ValidateSqlInput } from "@/src/application/sql-validator/dto/validate-sql.dto";
import { SqlValidationService } from "@/src/domain/sql-validator/services/sql-validation.service";
import { SchemaRepositoryPort } from "@/src/domain/sql-validator/ports/schema-repository.port";

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
