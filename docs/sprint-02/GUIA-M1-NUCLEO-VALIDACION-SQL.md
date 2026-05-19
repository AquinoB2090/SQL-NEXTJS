# Sprint 02 - Guia M1: Nucleo de Validacion SQL

## 1) Objetivo del sprint

Migrar el nucleo de validacion SQL del proyecto C++ al backend en Next.js (arquitectura hexagonal), implementando tres fases reales:

1. Lexica: tokenizacion SQL.
2. Sintactica: parser SELECT-FROM-WHERE.
3. Semantica: validacion contra esquema y permisos basicos.

Adicionalmente:

- Salida estructurada de validacion.
- Cobertura de pruebas unitarias >= 80%.
- Codigo extensible para reglas futuras.

## 2) Base actual (ya completada en M3)

- Puerto de esquema v2 (`findTable`, `findColumn`) con contrato estable.
- Repositorio de esquema tipado en memoria (`SchemaTable`, `SchemaColumn`, `DataType`).
- Normalizacion case-insensitive centralizada.
- Config por ambiente con `SCHEMA_SOURCE`.
- Suite de pruebas backend operativa (contrato/dominio/infra).

Esto permite construir M1 sin romper el desacople dominio/app/infra.

## 3) Alcance funcional M1 (recomendado)

Soportar formalmente:

- `SELECT <columnas|*> FROM <tabla> [WHERE <expresion-simple>]`

Para `WHERE` inicial:

- Operadores: `=`, `!=`, `<>`, `<`, `<=`, `>`, `>=`.
- Operando izquierdo: identificador de columna.
- Operando derecho: literal numerico o string.

Fuera de alcance en este sprint:

- `JOIN`
- Subqueries
- Funciones SQL complejas
- `GROUP BY`, `HAVING`, `ORDER BY`

## 4) Plan de implementacion (orden real)

1. Definir gramatica minima M1 y tabla de equivalencia C++ -> TypeScript.
2. Implementar tokenizador (`lexer`) como servicio de dominio.
3. Implementar parser (`SELECT-FROM-WHERE`) con AST tipada.
4. Refactorizar `SqlValidationService` para pipeline por fases.
5. Agregar validacion semantica basica de permisos via nuevo puerto.
6. Estandarizar salida estructurada de validacion.
7. Completar pruebas unitarias y medir cobertura >= 80%.
8. Actualizar documentacion tecnica y de limites del sprint.

## 5) Backlog tecnico por tickets

## Ticket M1-A - Modelo de tokens y AST

- Crear `TokenType`, `Token`, `TokenPosition`.
- Crear AST minima:
  - `SelectStatement`
  - `SelectProjection`
  - `WhereExpression`
- Definir errores tipados por fase (`LexicalError`, `SyntacticError`, `SemanticError`).

## Ticket M1-B - Tokenizador SQL (fase lexica)

- Implementar `SqlTokenizer` en dominio.
- Soportar:
  - keywords (`SELECT`, `FROM`, `WHERE`)
  - identificadores
  - coma, asterisco, punto y coma
  - operadores de comparacion
  - literales numericos y string basico
- Devolver tokens + errores lexicos sin excepciones no controladas.

Pruebas obligatorias:

- query valida completa.
- token desconocido.
- string sin cierre.
- espacios/tabs/saltos de linea.

## Ticket M1-C - Parser SELECT-FROM-WHERE (fase sintactica)

- Implementar parser determinista simple (recomendado: recursive descent).
- Consumir tokens del lexer.
- Validar orden gramatical de clausulas.
- Construir AST si es valida.
- Reportar errores con posicion y token esperado.

Pruebas obligatorias:

- `SELECT * FROM usuarios;`
- `SELECT nombre, edad FROM usuarios WHERE edad >= 18;`
- errores por orden invalido de clausulas.
- falta de `FROM`.
- `WHERE` incompleto.

## Ticket M1-D - Semantica basica (esquema + permisos)

- Reusar `SchemaRepositoryPort` actual para existencia y metadata.
- Crear puerto de permisos de dominio:
  - `canReadTable(context, tableName): boolean`
  - `canReadColumn(context, tableName, columnName): boolean`
- Implementar adaptador in-memory de permisos en infraestructura.
- Validar en semantica:
  - tabla existente
  - columnas existentes
  - permiso de lectura de tabla/columna

## Ticket M1-E - Integracion del pipeline de validacion

- Refactor de `SqlValidationService`:
  - `tokenize -> parse -> semanticValidate`
- Mantener compatibilidad con `phase: LEXICAL | SYNTACTIC | SEMANTIC`.
- Sustituir regex MVP por parser real.

## Ticket M1-F - Resultado estructurado + contrato

- Definir DTO de salida estructurada con:
  - `valid`
  - `phase`
  - `errors[]` tipados
  - `warnings[]`
  - `parsed` (AST resumida)
  - opcional `debug.tokens`
- Mantener coherencia FE/BE en `packages/sql-contracts`.

## Ticket M1-G - Pruebas y cobertura

- Organizar pruebas por capa:
  - `src/test/domain/lexer`
  - `src/test/domain/parser`
  - `src/test/domain/semantic`
- Alcanzar >= 80% cobertura del nucleo M1.
- Agregar script de coverage para CI/local.

## Ticket M1-H - Documentacion de migracion

- Documentar decisiones de equivalencia C++ -> TS.
- Registrar limites explicitos de M1.
- Registrar backlog de M2 (joins, subqueries, funciones).

## 6) Estructura recomendada de carpetas

```txt
apps/api-next/src/domain/sql-validator/
  ast/
  lexer/
  parser/
  semantic/
  ports/
    permissions.port.ts

apps/api-next/src/infrastructure/sql-validator/
  permissions/
    in-memory-permissions.repository.ts

apps/api-next/src/test/domain/
  lexer/
  parser/
  semantic/
```

## 7) Definition of Done (M1)

- Tokenizador SQL funcional con manejo de errores lexicos.
- Parser SELECT-FROM-WHERE funcional con AST y errores sintacticos.
- Semantica valida esquema y permisos basicos.
- Respuesta estructurada consistente para frontend.
- Cobertura unitaria >= 80% en modulos del nucleo M1.
- Documentacion de alcance y decisiones actualizada en `docs`.

## 8) Riesgos y mitigacion

- Riesgo: intentar migrar demasiada gramatica en un sprint.
  - Mitigacion: congelar alcance estricto M1 y posponer JOIN/subqueries.
- Riesgo: acoplar parser a infraestructura.
  - Mitigacion: mantener lexer/parser en `domain` sin dependencias externas.
- Riesgo: falta de trazabilidad de errores.
  - Mitigacion: estandarizar error tipado con fase y posicion.
- Riesgo: cobertura insuficiente.
  - Mitigacion: pruebas por fase desde inicio, no al final del sprint.

## 9) Entregables esperados al cierre

1. Nucleo M1 operativo en backend.
2. Suite de pruebas automatizada con cobertura >= 80%.
3. Contrato de salida actualizado y consumible por frontend.
4. Documento de decisiones de migracion y limites de alcance.

