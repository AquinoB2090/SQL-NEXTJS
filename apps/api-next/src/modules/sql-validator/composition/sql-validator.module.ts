import { ValidateSqlUseCase } from "../application/use-cases/validate-sql.use-case";
import { SqlValidatorController } from "../controller/sql-validator.controller";
import { SqlValidationService } from "../domain/services/sql-validation.service";
import { InMemorySchemaRepository } from "../infrastructure/repositories/in-memory-schema.repository";

export function createSqlValidatorController(): SqlValidatorController {
  const validationService = new SqlValidationService();
  const schemaRepository = new InMemorySchemaRepository();
  const useCase = new ValidateSqlUseCase(validationService, schemaRepository);

  return new SqlValidatorController(useCase);
}
