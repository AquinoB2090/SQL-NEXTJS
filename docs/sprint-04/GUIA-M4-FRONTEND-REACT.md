# Sprint 04 - Guia M4: Frontend React

## 1) Objetivo del sprint

Construir una interfaz frontend enfocada en diagnostico SQL, conectada al backend hexagonal ya implementado, con:

1. Formulario React para escribir query SQL.
2. Consumo de API y estado visual `VALIDA/INVALIDA`.
3. Visualizacion de fase, errores y salida parseada.
4. UX diagnostica, responsive y uso estricto de tipos compartidos.

## 2) Base actual (ya implementada)

- App React funcional en `apps/web-react`.
- Cliente API `validateSql` consumiendo `POST /api/sql/validate`.
- Tipos compartidos desde `@hex/sql-contracts`.
- UI existente con editor y panel de salida.

## 3) Gaps para cerrar M4

- El estado de validacion actual marca `success/error` por excepcion, no por semantica de `valid` del reporte.
- No hay panel diagnostico claro por fase (`LEXICAL`, `SYNTACTIC`, `SEMANTIC`).
- La salida parseada se muestra como JSON crudo, sin estructura pensada para usuario.
- Falta normalizar UX de errores de red vs errores funcionales.
- Responsive existe, pero hay que validar experiencia movil para flujo principal de diagnostico.

## 4) Alcance funcional M4

Incluido:

- Editor/textarea SQL con acciones minimas (validar, limpiar, ejemplo).
- Estado visual principal:
  - `VALIDA` cuando `response.data.valid === true`.
  - `INVALIDA` cuando `response.data.valid === false`.
  - `ERROR DE API` para fallos de red/infra.
- Panel de diagnostico con:
  - fase
  - lista de errores
  - warnings
  - salida parseada (`table`, `columns`).
- Tipado compartido en toda la capa API/UI.
- Vista responsive (mobile-first para panel principal).

Fuera de alcance:

- Editor avanzado con resaltado sintactico completo.
- Historial persistente en backend.
- Multiusuario y autenticacion.

## 5) Plan recomendado de implementacion (orden real)

1. Refactor de estado de UI para separar:
  - estado de request (`idle/loading/error`)
  - estado de validacion (`valid/invalid`).
2. Ajustar gateway API para devolver errores tipados sin perder `error.code`.
3. Crear componentes de diagnostico:
  - `ValidationStatusBadge`
  - `ValidationPhasePanel`
  - `ValidationErrorsList`
  - `ParsedResultPanel`
4. Integrar render condicional por estado.
5. Revisar layout responsive de flujo principal.
6. Agregar pruebas unitarias de componentes criticos.
7. Agregar prueba de integracion UI->API mock.
8. Documentar convenciones de UX diagnostica.

## 6) Backlog tecnico por tickets

## Ticket M4-A - Modelo de estado de frontend

- Definir estado explicito:
  - `requestState: "idle" | "loading" | "network-error"`
  - `validationState: "unknown" | "valid" | "invalid"`
- Evitar inferencias por string en output.

## Ticket M4-B - Cliente API tipado y robusto

- Mantener `ValidateSqlApiResponse` como contrato principal.
- Retornar objeto de error tipado para UI:
  - `code`
  - `message`
  - `httpStatus` (si aplica).
- Distinguir errores funcionales (`ok: false`) de errores de red.

## Ticket M4-C - Formulario de query SQL

- Componente dedicado `SqlQueryForm`:
  - textarea
  - contador de caracteres
  - boton validar
  - boton limpiar
  - boton ejemplo
- Accesibilidad minima:
  - `label` asociado
  - `aria-live` para estado de validacion.

## Ticket M4-D - Estado VALIDA/INVALIDA

- Mostrar indicador principal por `report.valid`.
- Paleta visual consistente:
  - verde: valida
  - rojo: invalida
  - neutro/amarillo: pendiente o warning.

## Ticket M4-E - Panel de fase, errores y parse

- `ValidationPhasePanel`: fase actual (`LEXICAL`, `SYNTACTIC`, `SEMANTIC`).
- `ValidationErrorsList`: errores y warnings en listas separadas.
- `ParsedResultPanel`: mostrar estructura parseada de forma legible:
  - tabla detectada
  - columnas detectadas
  - fallback a JSON para debug.

## Ticket M4-F - UX diagnostica y mensajes claros

- Mensajes orientados a accion:
  - que fallo
  - en que fase
  - siguiente paso sugerido
- Manejo visual distinto para:
  - error de validacion SQL
  - error de API/red.

## Ticket M4-G - Responsive y layout

- Priorizar mobile para flujo:
  1. editor
  2. boton validar
  3. estado
  4. diagnostico
- Evitar overflow horizontal en paneles de salida.
- Ajustar tipografia/espaciado para 360px+.

## Ticket M4-H - Pruebas frontend

- Unit tests:
  - mapeo de estados (`valid`, `invalid`, `network-error`)
  - render de fase y errores.
- Integracion:
  - mock de API valida.
  - mock de API invalida.
  - mock de fallo de red.

## Ticket M4-I - Documentacion y handoff

- Actualizar `README` con flujo frontend.
- Documentar ejemplos de respuesta esperada desde backend.
- Dejar checklist de QA manual para UI.

## 7) Estructura recomendada de carpetas

```txt
apps/web-react/src/
  features/sql-validator/
    components/
      SqlQueryForm.tsx
      ValidationStatusBadge.tsx
      ValidationPhasePanel.tsx
      ValidationErrorsList.tsx
      ParsedResultPanel.tsx
    hooks/
      useSqlValidation.ts
    models/
      validation-view.model.ts
  api/
    sql-validator.api.ts
  App.tsx
  styles.css (o estilos modulares por componente)
```

## 8) Criterios de aceptacion (Definition of Done M4)

- Usuario puede ingresar query y validar con un click.
- UI muestra claramente `VALIDA` o `INVALIDA` basado en `report.valid`.
- UI muestra fase, errores/warnings y salida parseada.
- Errores de red/API se muestran diferenciados de errores SQL.
- Frontend usa tipos compartidos sin duplicar contratos.
- Flujo usable en desktop y mobile.
- Pruebas de frontend ejecutan y cubren casos principales.

## 9) Riesgos y mitigacion

- Riesgo: confundir error de red con query invalida.
  - Mitigacion: canales de error separados en estado y UI.
- Riesgo: UI demasiado cargada y poco clara.
  - Mitigacion: priorizar panel diagnostico central y ocultar secundarios.
- Riesgo: drift de tipos FE/BE.
  - Mitigacion: consumir siempre `@hex/sql-contracts`, sin tipos locales duplicados.
- Riesgo: deuda visual por estilos globales grandes.
  - Mitigacion: encapsular componentes nuevos por feature.

## 10) Entregables esperados al cierre

1. Interfaz React orientada a diagnostico SQL.
2. Consumo robusto de API con estados claros.
3. Visualizacion de fase/errores/parse para soporte funcional.
4. Responsive validado en pantallas pequenas y desktop.
5. Documentacion de uso y QA para el equipo.

