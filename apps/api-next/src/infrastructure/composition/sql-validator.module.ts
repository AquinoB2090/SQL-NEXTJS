import { ValidateSqlUseCase } from "@/src/application/sql-validator/use-cases/validate-sql.use-case";
import { SqlValidationService } from "@/src/domain/sql-validator/services/sql-validation.service";
import { SqlValidatorController } from "@/src/infrastructure/http/controllers/sql-validator.controller";
import { InMemorySchemaRepository } from "@/src/infrastructure/sql-validator/repositories/in-memory-schema.repository";

export function createSqlValidatorController(): SqlValidatorController {
  const validationService = new SqlValidationService();
  const schemaRepository = new InMemorySchemaRepository();
  const useCase = new ValidateSqlUseCase(validationService, schemaRepository);

  return new SqlValidatorController(useCase);
}
