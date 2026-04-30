# SQL Nextjs - Hexagonal (Intuitivo para MVC)

Este proyecto esta organizado para que, si vienes de MVC, te sea facil ubicarte.

## Mapeo mental MVC -> Hexagonal

- `Controller` (MVC) -> `infrastructure/http/controllers`
- `Service` (MVC) -> `application/*/use-cases`
- `Repository` (MVC) -> `infrastructure/*/repositories`
- `Model de negocio` (MVC) -> `domain/*`

## Estructura

```txt
apps/
  api-next/
    src/
      app/                          # Next.js (entrypoint HTTP)
      application/
        sql-validator/
          dto/
          use-cases/
      domain/
        sql-validator/
          entities/
          ports/
          services/
      infrastructure/
        composition/
        http/controllers/
        sql-validator/repositories/
  web-react/
packages/
  sql-contracts/
docs/
  sprint-01/
  architecture/
```

## Entregables Sprint 01

- Alcance MVP y exclusiones: `docs/sprint-01/mvp-scope.md`
- Arquitectura hexagonal (domain/app/infra): `docs/architecture/hexagonal-domain-app-infra.md`
- Contratos compartidos FE/BE: `packages/sql-contracts/src/index.ts`

## Instalacion

```bash
npm install
```

## Levantar backend

```bash
npm run dev:api
```

## Levantar frontend

```bash
npm run dev:web
```
