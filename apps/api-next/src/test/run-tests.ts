import { runInMemoryRepositoryContractTest } from "@/src/test/contracts/in-memory-schema.repository.contract.test";
import { runSqlValidationServiceTests } from "@/src/test/domain/sql-validation.service.test";
import { runSchemaRepositoryFactoryTests } from "@/src/test/infrastructure/schema-repository.factory.test";

interface TestSuite {
  name: string;
  run: () => void;
}

const suites: TestSuite[] = [
  {
    name: "Contract | InMemorySchemaRepository",
    run: runInMemoryRepositoryContractTest,
  },
  {
    name: "Domain | SqlValidationService",
    run: runSqlValidationServiceTests,
  },
  {
    name: "Infrastructure | SchemaRepositoryFactory",
    run: runSchemaRepositoryFactoryTests,
  },
];

let passed = 0;
const failures: string[] = [];

for (const suite of suites) {
  try {
    suite.run();
    passed += 1;
    console.log(`PASS ${suite.name}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error no identificado";
    failures.push(`FAIL ${suite.name}: ${message}`);
  }
}

for (const failure of failures) {
  console.error(failure);
}

console.log(`\nResumen: ${passed}/${suites.length} suites aprobadas.`);

if (failures.length > 0) {
  process.exitCode = 1;
}

