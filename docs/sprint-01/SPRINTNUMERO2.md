# Sprint 01 - M3 Infraestructura de Esquema (Guia de Trabajo)

## 1) Estado actual (analisis del repo)

### Lo que ya esta implementado

- Estructura hexagonal base documentada y aplicada en `apps/api-next` (domain/application/infra) con entrypoint Next.js.
- Puerto de esquema `SchemaRepositoryPort` con metodos `existsTable` y `existsColumn`.
- Adaptador `InMemorySchemaRepository` ya conectado en composition root.
- Validacion semantica del servicio de dominio consume el puerto (no depende de infraestructura).
- Contratos compartidos FE/BE y endpoint funcional `POST /api/sql/validate`.

### Evidencias clave

- Puerto: `apps/api-next/src/domain/sql-validator/ports/schema-repository.port.ts`
- Repo en memoria: `apps/api-next/src/infrastructure/sql-validator/repositories/in-memory-schema.repository.ts`
- Uso del puerto en dominio: `apps/api-next/src/domain/sql-validator/services/sql-validation.service.ts`
- Wiring en infraestructura: `apps/api-next/src/infrastructure/composition/sql-validator.module.ts`
- Alcance MVP: `docs/sprint-01/mvp-scope.md`

### Gap funcional contra referencia C++

- En C++ el schema incluye metadatos de tipo (`INT`, `VARCHAR`, `FLOAT`) y resolucion case-insensitive en tabla y columna.
- En Next actual el schema guarda solo `string[]` de columnas (sin tipos), y la semantica no valida compatibilidad de tipos en `WHERE`.

## 2) Estado por requerimiento M3

## RF-M3-01: Implementar repositorio de esquema en memoria

**Estado:** Parcialmente cumplido (base creada).  
**Falta para cerrar al 100%:**

- Modelar columnas con tipo, no solo nombre.
- Exponer lectura de metadata (tabla, columnas, tipos).
- Preparar carga de schema desde configuracion (no hardcode estricto).

## RF-M3-02: Resolver tabla/columnas con case-insensitive

**Estado:** Cumplido en MVP para existencia (`toLowerCase()` en tabla y columna).  
**Falta para robustez:**

- Centralizar normalizacion (`normalizeIdentifier`) para evitar dispersion.
- Definir politica uniforme (trim + lowercase + validacion de identificador vacio).
- Cubrir pruebas con mayus/minus mixtas en tabla y columnas.

## RF-M3-03: Crear puertos/interfaces para desacoplar el dominio

**Estado:** Parcialmente cumplido (existe 1 puerto).  
**Falta para cerrar al 100%:**

- Evolucionar el puerto para casos semanticos futuros (tipos de columna).
- Separar contratos de lectura de schema en interfaz mas expresiva (no solo booleanos).
- Mantener dominio sin dependencias a DTO/HTTP/Next (ya va bien).

## PARTE DE JOSHUA

## RNF-M3: Config por ambiente y pruebas de contrato del repo

**Estado:** Pendiente.  
**Falta para cerrar al 100%:**

- Estrategia de config por ambiente (dev/test/prod) para fuente de schema.
- Suite de pruebas de contrato del repositorio (debe pasar para cualquier implementacion del puerto).
- Scripts de test y convencion de carpetas de pruebas.

## 3) Plan recomendado de implementacion (orden real)

1. **Refactor de modelo de schema (base de RF-M3-01 y RF-M3-03).**
2. **Ampliar puerto de dominio para metadata y tipos.**
3. **Actualizar `InMemorySchemaRepository` al nuevo contrato.**
4. **Ajustar `SqlValidationService` para usar metadata y preparar type-check de `WHERE`.**
5. **Agregar config por ambiente para inicializar schema.**
6. **Crear pruebas de contrato del repositorio + pruebas de dominio sobre case-insensitive.**
7. **Actualizar docs de arquitectura y alcance M3.**

## 4) Backlog tecnico detallado por ticket

## Ticket A - Modelo de schema tipado (RF-M3-01)

- Crear entidad/VO de dominio para `SchemaTable`, `SchemaColumn`, `DataType`.
- Migrar repo en memoria de `Record<string, string[]>` a estructura tipada.
- Mantener compatibilidad con validaciones existentes.

## Ticket B - Puerto de schema v2 (RF-M3-03)

- Extender interfaz:
  - `findTable(tableName): SchemaTable | null`
  - `findColumn(tableName, columnName): SchemaColumn | null`
  - Mantener `exists*` como wrappers opcionales para transicion.
- Ajustar use case/servicio para depender de los nuevos metodos.

## Ticket C - Case-insensitive robusto (RF-M3-02)

- Implementar util unico en dominio para normalizar identificadores.
- Aplicarlo en repo y en puntos de entrada semantica.
- Casos de prueba obligatorios:
  - `USUARIOS`, `Usuarios`, `uSuArIoS`
  - `NOMBRE`, `Nombre`, `nOmBrE`
  - Entradas con espacios y string vacio.

## Ticket D - Config por ambiente (RNF-M3)

- Definir variable de entorno para fuente de schema (ejemplo: `SCHEMA_SOURCE=in-memory`).
- Crear factory de repositorio en composition root segun ambiente.
- Incluir `.env.example` y documentar defaults.

## Ticket E - Pruebas de contrato (RNF-M3)

- Definir suite reutilizable que pruebe el comportamiento del puerto:
  - existencia de tabla/columna
  - case-insensitive
  - metadata de tipos
  - comportamiento con tabla inexistente
- Ejecutar la misma suite sobre `InMemorySchemaRepository`.

## 5) Criterios de aceptacion sugeridos (Definition of Done M3)

- Cualquier adaptador de schema que implemente el puerto pasa la suite de contrato sin cambiar tests.
- Dominio sigue desacoplado de framework y de clases de infraestructura.
- Validaciones semanticas de tabla/columna son case-insensitive con cobertura de pruebas.
- Config por ambiente permite cambiar implementacion de repo sin tocar dominio.
- Documentacion M3 actualizada con decisiones y limites.

## 6) Riesgos actuales y mitigacion

- **Riesgo:** mantener repo como `string[]` limita migracion del analizador semantico del C++.
  - **Mitigacion:** introducir tipos de columna en este sprint.
- **Riesgo:** no hay pruebas automatizadas del backend para regresion.
  - **Mitigacion:** iniciar por pruebas de contrato del puerto y pruebas unitarias de servicio de dominio.
- **Riesgo:** wiring de dependencias puede crecer acoplado en `module.ts`.
  - **Mitigacion:** usar factory por ambiente y contratos claros.
