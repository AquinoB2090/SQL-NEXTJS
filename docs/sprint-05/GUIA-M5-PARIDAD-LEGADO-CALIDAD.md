# Sprint 05 - Guia M5: Paridad con Legado y Calidad

## 1) Objetivo del sprint

Garantizar que el nuevo backend de validacion SQL en Next.js alcance paridad funcional con el legado C/C++ y quede protegido contra regresiones:

1. Suite de pruebas equivalente al legado.
2. Comparacion automatizada C/C++ vs backend y reporte de divergencias.
3. Trazabilidad por fase (`LEXICAL`, `SYNTACTIC`, `SEMANTIC`) y cero regresiones criticas.

## 2) Base actual (ya implementada en sprints previos)

- Arquitectura hexagonal estable en backend.
- Modelo de schema tipado + normalizacion case-insensitive.
- Validacion SQL por fases con contrato compartido FE/BE.
- Endpoint API funcional y pruebas backend activas.
- Guias de M1, M2 y M4 ya definidas.

Esto permite atacar M5 como sprint de consolidacion y calidad.

## 3) Alcance funcional M5

Incluido:

- Recolectar y versionar casos del legado C/C++.
- Ejecutar mismos casos en ambos motores (legacy y backend).
- Generar reporte de diferencias normalizado.
- Clasificar diferencias (esperadas, bug backend, bug legado, alcance no migrado).
- Agregar trazabilidad detallada por fase en backend.
- Bloquear merge si aparecen regresiones criticas.

Fuera de alcance:

- Reescritura completa del compilador C++.
- Soporte de nuevas features SQL fuera del roadmap.

## 4) Plan recomendado de implementacion (orden real)

1. Inventariar casos legacy y definir formato unico de fixtures.
2. Construir suite automatizada equivalente (backend).
3. Construir runner de comparacion dual (legacy vs backend).
4. Generar reporte de divergencias con clasificacion.
5. Corregir divergencias criticas priorizadas.
6. Implementar trazabilidad por fase y request-id.
7. Endurecer pipeline de regresion en CI.
8. Publicar reporte final de paridad y riesgos residuales.

## 5) Backlog tecnico por tickets

## Ticket M5-A - Inventario y normalizacion de casos legado

- Extraer consultas y escenarios historicos desde `compilador-sql-final-main`.
- Definir fixture unico versionado, por ejemplo:
  - `id`
  - `query`
  - `expected.phase`
  - `expected.valid`
  - `expected.errors`
  - `tags` (legacy, edge, regression, known-gap).
- Guardar en `json` o `yaml` bajo `docs` o `apps/api-next/src/test/fixtures`.

## Ticket M5-B - Suite equivalente del backend

- Crear pruebas automatizadas que consuman fixtures legacy.
- Ejecutar cada caso sobre el backend actual (servicio de dominio o API).
- Validar resultados normalizados:
  - `valid`
  - `phase`
  - presencia/ausencia de errores clave
- Marcar casos fuera de alcance de M1/M2 como `known-gap` para no falsear fallos.

## Ticket M5-C - Runner comparativo C/C++ vs backend

- Crear script de comparacion dual:
  1. Ejecuta caso en legado C/C++.
  2. Ejecuta caso equivalente en backend.
  3. Normaliza salidas para comparacion estable.
- Salida del runner:
  - `match`
  - `mismatch`
  - detalle de campos que difieren.

## Ticket M5-D - Reporte de divergencias

- Generar reporte legible (md/json/csv) con:
  - total casos
  - matches
  - mismatches
  - cobertura por fase
  - top divergencias por tipo.
- Clasificar divergencias:
  - `BUG_BACKEND`
  - `BUG_LEGACY`
  - `KNOWN_GAP`
  - `NON_DETERMINISTIC`.

## Ticket M5-E - Correccion de divergencias criticas

- Priorizar mismatches que rompan reglas base del negocio.
- Corregir backend sin romper contratos existentes.
- Re-ejecutar suite comparativa hasta estabilizar.

## Ticket M5-F - Trazabilidad por fase

- Implementar trazas estructuradas por request:
  - `requestId`
  - `phase`
  - `durationMs`
  - `result.valid`
  - `errorCount`
- Trazas minimas por cada transicion:
  - entrada request
  - salida lexico
  - salida sintactico
  - salida semantico
  - respuesta final.

## Ticket M5-G - Cero regresiones criticas (gates de calidad)

- Definir regresion critica:
  - cambia `valid` de casos core
  - cambia fase de error core
  - introduce error 500 en API.
- Agregar quality gates en CI:
  - suite legado equivalente obligatoria
  - comparacion dual sin regresiones criticas
  - pruebas unitarias/integracion previas en verde.

## Ticket M5-H - Documentacion de paridad y deuda residual

- Publicar documento final:
  - porcentaje de paridad alcanzada
  - casos no migrados (justificados)
  - deuda tecnica restante
  - plan de cierre para siguiente sprint.

## 6) Estructura recomendada de carpetas

```txt
apps/api-next/src/test/
  fixtures/
    legacy-sql-cases.json
  parity/
    legacy-equivalent.test.ts
    legacy-vs-backend.diff.test.ts
  regression/
    critical-regression.test.ts

apps/api-next/scripts/
  compare-legacy-vs-backend.ts
  export-parity-report.ts

docs/sprint-05/
  GUIA-M5-PARIDAD-LEGADO-CALIDAD.md
  REPORTE-PARIDAD.md
```

## 7) Criterios de aceptacion (Definition of Done M5)

- Existe suite equivalente al legado y corre automaticamente.
- Existe comparacion C/C++ vs backend con reporte de divergencias.
- Divergencias criticas resueltas o clasificadas con plan claro.
- Trazabilidad por fase activa y util para debugging.
- Cero regresiones criticas en pipeline de CI.
- Documento final de paridad publicado.

## 8) Metricas obligatorias de calidad

- `% paridad global`: casos que coinciden / total casos comparables.
- `% paridad por fase`: lexico, sintactico, semantico.
- `regresiones criticas`: debe ser 0 al cierre.
- `tiempo de deteccion de divergencias`: medible por pipeline.

## 9) Riesgos y mitigacion

- Riesgo: casos legacy ambiguos o incompletos.
  - Mitigacion: normalizar fixtures y documentar supuestos.
- Riesgo: falsos positivos por diferencias de formato de mensaje.
  - Mitigacion: comparacion por estructura/codigo, no solo texto literal.
- Riesgo: alcance no migrado contamina metricas de paridad.
  - Mitigacion: etiquetar `known-gap` y reportar separado.
- Riesgo: overhead de logging afecta rendimiento.
  - Mitigacion: niveles de log por ambiente y muestreo controlado.

## 10) Entregables esperados al cierre

1. Fixture oficial de casos legacy versionado.
2. Suite automatizada equivalente + runner comparativo dual.
3. Reporte de divergencias con clasificacion accionable.
4. Trazabilidad por fase operativa para soporte tecnico.
5. Pipeline con gates de cero regresiones criticas.
6. Documento final de paridad y roadmap de deuda residual.

