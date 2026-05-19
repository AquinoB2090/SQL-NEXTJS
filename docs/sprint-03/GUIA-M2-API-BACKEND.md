# Sprint 03 - Guia M2: API Backend

## 1) Objetivo del sprint

Consolidar la capa HTTP del validador SQL para produccion inicial:

1. Exponer y robustecer `POST /api/sql/validate`.
2. Validar payload JSON y limites de tamano.
3. Definir contrato estable de respuesta y errores claros.
4. Garantizar comportamiento stateless.
5. Integrar todo el flujo y cumplir objetivo de rendimiento `p95 < 200 ms`.

## 2) Estado actual (base ya existente)

Lo que ya existe:

- Endpoint `POST /api/sql/validate` en Next.js.
- Flujo hexagonal conectado (`route -> controller -> use case -> domain`).
- Contrato compartido FE/BE en `packages/sql-contracts`.
- Manejo base de errores:
  - `INVALID_JSON_BODY`
  - `INVALID_QUERY_PAYLOAD`

Gaps para cerrar M2:

- Limite de tamano de body no implementado.
- Validacion de payload aun minima (solo `query` string).
- Catalogo de errores HTTP todavia corto para casos operativos.
- Pruebas de integracion HTTP incompletas.
- Medicion formal de latencia p95 no automatizada.

## 3) Alcance funcional M2

Incluido en M2:

- Endpoint `POST /api/sql/validate` estable.
- Validacion de `Content-Type`, JSON valido y tamaño maximo configurable.
- Errores claros con codigos de negocio + status HTTP coherente.
- API stateless (sin sesion, sin cache mutable por usuario en memoria de proceso).
- Pruebas de integracion de extremo a extremo + prueba de rendimiento p95.

Fuera de alcance M2:

- Autenticacion/autorizacion completa.
- Rate limiting distribuido multi-nodo.
- Persistencia de auditoria en base de datos.

## 4) Plan recomendado de implementacion (orden real)

1. Definir contrato final de entrada/salida para M2.
2. Crear modulo de configuracion HTTP por ambiente (payload size, timeouts).
3. Endurecer `route.ts` con validaciones de request antes del controller.
4. Ajustar controller y contrato para errores detallados y consistentes.
5. Agregar pruebas de integracion API (casos felices y fallos).
6. Instrumentar benchmark simple y medir p95.
7. Ajustar puntos de rendimiento hasta cumplir `< 200 ms`.
8. Documentar SLA, limites y codigos de error.

## 5) Backlog tecnico por tickets

## Ticket M2-A - Contrato API estable (request/response/error)

- Actualizar `packages/sql-contracts` para incluir:
  - request con `query` y campos opcionales de contexto (si aplica M1/M2).
  - catalogo extendido de errores.
- Definir mapeo fijo `error.code -> status HTTP`.

Errores sugeridos:

- `INVALID_JSON_BODY` -> 400
- `UNSUPPORTED_CONTENT_TYPE` -> 415
- `PAYLOAD_TOO_LARGE` -> 413
- `INVALID_QUERY_PAYLOAD` -> 422
- `INTERNAL_VALIDATION_ERROR` -> 500

## Ticket M2-B - Validacion de entrada y limites de seguridad

- En `route.ts`, validar:
  - metodo permitido (si aplica fallback a 405).
  - `Content-Type: application/json`.
  - tamano maximo body (`MAX_SQL_PAYLOAD_BYTES` por env).
- Rechazar entradas vacias o no-objeto antes del controller.

Variable recomendada:

- `MAX_SQL_PAYLOAD_BYTES=8192` (ajustable por ambiente).

## Ticket M2-C - Config por ambiente para API

- Crear `http-config` en infraestructura/composition:
  - `MAX_SQL_PAYLOAD_BYTES`
  - opciones de trazas y log level
- Mantener defaults por `NODE_ENV`.
- Actualizar `.env.example` y docs.

## Ticket M2-D - Endurecimiento stateless

- Verificar y documentar:
  - no uso de estado mutable por request.
  - no almacenamiento de sesion en memoria.
  - dependencias compartidas seguras para concurrencia.
- Si se usa cache, que sea solo de solo-lectura o explicitamente inmutable.

## Ticket M2-E - Pruebas de integracion backend

- Crear pruebas sobre endpoint real:
  - 200 consulta valida.
  - 400 JSON invalido.
  - 415 content-type incorrecto.
  - 413 payload excedido.
  - 422 payload con `query` invalido.
- Validar estructura exacta de contrato de respuesta.

## Ticket M2-F - Rendimiento y p95

- Crear script de benchmark reproducible (`npm run perf:api`).
- Medir latencia con carga representativa (ej. 50-100 conexiones, duracion fija).
- Registrar:
  - p50, p95, p99
  - throughput
  - errores
- Objetivo obligatorio: `p95 < 200 ms`.

## Ticket M2-G - Observabilidad minima para debugging

- Incluir request-id simple por request (si no existe) para trazabilidad.
- Logging estructurado de errores de entrada.
- Evitar logs sensibles (no volcar payload completo en produccion).

## Ticket M2-H - Documentacion de operacion API

- Documento de contrato final + ejemplos de error/exito.
- Limites operativos (payload maximo, SLA objetivo).
- Guia de pruebas locales e interpretacion del benchmark.

## 6) Estructura recomendada de carpetas

```txt
apps/api-next/src/
  app/api/sql/validate/
    route.ts
  infrastructure/
    composition/
      http-config.ts
    http/
      controllers/
      middleware/ (opcional)
  test/
    integration/
      api/
        validate-sql.route.test.ts
    performance/
      api/
        validate-sql.perf.ts (o script dedicado)
```

## 7) Criterios de aceptacion (Definition of Done M2)

- Endpoint `POST /api/sql/validate` estable y documentado.
- Validacion estricta de JSON, `Content-Type` y tamano maximo de payload.
- Contrato de respuesta consistente y tipado para exito/error.
- API confirmada como stateless.
- Suite de integracion HTTP pasando en CI/local.
- Reporte de performance con `p95 < 200 ms`.
- Documentacion actualizada en `docs`.

## 8) Riesgos y mitigacion

- Riesgo: sobrecosto por parseo/validacion en cada request.
  - Mitigacion: validaciones O(n), evitar trabajo duplicado y objetos intermedios innecesarios.
- Riesgo: p95 variable entre equipos/maquinas.
  - Mitigacion: benchmark con perfil fijo y reporte de contexto (CPU, concurrencia, duracion).
- Riesgo: errores no uniformes entre capas.
  - Mitigacion: mapper central `error.code -> HTTP status`.
- Riesgo: deuda al mezclar reglas de dominio con HTTP.
  - Mitigacion: mantener validaciones HTTP en `route/controller` y reglas SQL en dominio.

## 9) Entregables esperados al cierre

1. API backend robusta para consumo de frontend.
2. Contrato de errores completo y estable.
3. Integracion E2E del flujo de validacion desde HTTP.
4. Evidencia de rendimiento con `p95 < 200 ms`.
5. Documentacion de operacion y limites lista para el equipo.

