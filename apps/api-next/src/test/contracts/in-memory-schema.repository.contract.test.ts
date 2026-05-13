import { runSchemaRepositoryContractSuite } from "@/src/test/contracts/schema-repository.contract";
import { InMemorySchemaRepository } from "@/src/infrastructure/sql-validator/repositories/in-memory-schema.repository";

export function runInMemoryRepositoryContractTest(): void {
  runSchemaRepositoryContractSuite({
    implementationName: "InMemorySchemaRepository",
    createRepository: () => new InMemorySchemaRepository(),
  });
}
