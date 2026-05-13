import { ValidateSqlUseCase } from "@/src/application/sql-validator/use-cases/validate-sql.use-case";
import { SqlValidationService } from "@/src/domain/sql-validator/services/sql-validation.service";
import { SqlValidatorController } from "@/src/infrastructure/http/controllers/sql-validator.controller";
import { createSchemaRepository } from "@/src/infrastructure/composition/schema-repository.factory";

// Composition Root: unico lugar donde se "cablean" dependencias concretas.
export function createSqlValidatorController(): SqlValidatorController {
  const validationService = new SqlValidationService();
  const schemaRepository = createSchemaRepository();
  const useCase = new ValidateSqlUseCase(validationService, schemaRepository);

  return new SqlValidatorController(useCase);
}
