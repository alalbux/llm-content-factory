# packages/shared

Pacote compartilhado do monorepo **LLM Content Factory**.

## O que vive aqui
- Tipos de domínio (Campaign, Content, Jobs)
- Schemas de validação (Zod)
- Constantes globais
- Clients reutilizáveis
- Utilitários puros

## O que NÃO vive aqui
- Código específico de Next.js
- Código específico de Strapi runtime
- Estado
- Lógica de negócio pesada

## Uso

```ts
import { Campaign, CHANNELS, PlanCampaignJobSchema } from "@content-factory/shared";
```


### Regra de ouro
Se dois apps importam o mesmo tipo, ele deve morar aqui.


---

## 🔧 Como usar nos apps

Se estiver usando **workspaces (npm/pnpm/yarn)**:

```ts
import { CHANNELS } from "@content-factory/shared";
```

E rodar:

```
npm install
npm run build --workspace=@content-factory/shared
```