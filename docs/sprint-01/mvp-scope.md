# Sprint 01 - Alcance MVP

## Objetivo de la fase
Definir una base funcional en Next.js + TypeScript para validar sentencias SQL simples (`SELECT ... FROM ...`) con arquitectura hexagonal y contratos tipados compartidos entre frontend y backend.

## Alcance MVP (incluido)
- Base backend en `apps/api-next` con endpoint `POST /api/sql/validate`.
- Flujo de validacion SQL en tres fases: `LEXICAL`, `SYNTACTIC`, `SEMANTIC`.
- Caso de uso de aplicacion desacoplado del framework.
- Puerto de dominio para repositorio de esquema (`SchemaRepositoryPort`) con adaptador inicial en memoria.
- Contratos compartidos FE/BE en `packages/sql-contracts`.
- Frontend (`apps/web-react`) consumiendo contrato tipado compartido.
- Composicion de dependencias en capa de infraestructura.

## Exclusiones de la fase
- Migracion completa de todos los modulos del compilador C++.
- Ejecucion real de consultas SQL en motor de base de datos.
- Persistencia real (solo repositorio en memoria para MVP).
- Soporte de SQL avanzado (JOIN complejos, subqueries profundas, DDL, funciones agregadas extendidas).
- AST completo equivalente al compilador C++ original.
- Autenticacion/autorizacion, multiusuario y auditoria.
- Observabilidad avanzada (tracing distribuido, metricas de negocio en produccion).
- Hardening de seguridad para produccion.

## Criterios de aceptacion Sprint 01
- Existe una ruta funcional `POST /api/sql/validate` con respuesta tipada.
- El flujo FE/BE usa tipos compartidos del paquete `@hex/sql-contracts`.
- Las capas hexagonales estan separadas por responsabilidad y direccion de dependencias.
- Se documenta explicitamente alcance y exclusiones del MVP.

## Nota de control
La carpeta `compilador-sql-final-main` se mantiene como referencia y no forma parte de los cambios de esta fase.
