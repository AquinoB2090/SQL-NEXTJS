# Arquitectura Hexagonal - Sprint 01

## Capas objetivo
- `domain`: reglas de negocio puras y contratos de salida/entrada de dominio.
- `app` (application): orquestacion de casos de uso, sin depender de framework HTTP.
- `infra`: adaptadores concretos (HTTP, repositorios, composition root).

## Mapeo en este repositorio
Para evitar conflicto con la carpeta de rutas de Next.js (`src/app`), la capa `app` hexagonal se implementa en `src/application`.

- Domain
  - `apps/api-next/src/domain/sql-validator/entities`
  - `apps/api-next/src/domain/sql-validator/services`
  - `apps/api-next/src/domain/sql-validator/ports`
- App (Application Layer)
  - `apps/api-next/src/application/sql-validator/dto`
  - `apps/api-next/src/application/sql-validator/use-cases`
- Infra
  - `apps/api-next/src/infrastructure/http/controllers`
  - `apps/api-next/src/infrastructure/sql-validator/repositories`
  - `apps/api-next/src/infrastructure/composition`
- Entrypoint framework (Next.js)
  - `apps/api-next/src/app/api/sql/validate/route.ts`

## Reglas de dependencia
- `domain` no depende de `app`, `infra` ni Next.js.
- `app` depende de `domain` y de contratos compartidos.
- `infra` depende de `app`, `domain` y framework.
- El entrypoint de Next.js solo invoca infraestructura/composicion.

## Flujo de request
1. `route.ts` recibe HTTP y parsea JSON.
2. Se resuelve el controlador desde `composition`.
3. El controlador valida payload y llama al caso de uso.
4. El caso de uso delega en servicio de dominio + puerto de esquema.
5. El adaptador de repositorio en memoria implementa el puerto.
6. Respuesta vuelve en contrato tipado compartido FE/BE.

## Contratos compartidos
Los contratos en `packages/sql-contracts` definen:
- endpoint compartido (`VALIDATE_SQL_ENDPOINT`)
- request/response de validacion SQL
- envoltorio estandar de API (`ApiResponse<T, E>`)
- codigos de error de contrato (`ValidateSqlErrorCode`)

## Decisiones de Sprint 01
- Se prioriza simplicidad y trazabilidad de capas sobre cobertura completa del compilador C++.
- Se estandariza tipado de respuesta para reducir divergencias FE/BE.
- Se deja preparado el crecimiento de adaptadores (DB real, parser avanzado) para sprintes posteriores.
