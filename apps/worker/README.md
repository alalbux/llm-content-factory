# ⚙️ apps/worker — Content Orchestrator

Este serviço é o **worker assíncrono** do projeto **LLM Content Factory**.

Ele consome jobs de uma fila (**BullMQ + Redis**) e executa a **orquestração de conteúdo com LLMs**, integrando com o Strapi CMS e serviços externos (OpenAI).

> Se o `apps/web` é o cérebro do produto
> o `apps/worker` é o **motor que faz tudo acontecer**.

---

## 🎯 Responsabilidades

O worker é responsável por:

* Planejar campanhas de conteúdo (LLM Planner)
* Criar tarefas de conteúdo por canal
* Gerar drafts automaticamente (LLM Generator)
* Revisar qualidade e risco (LLM Critic)
* Persistir resultados no Strapi
* Controlar status e fluxo assíncrono
* Garantir retries e isolamento de falhas

Ele **não expõe API pública** e **não serve UI**.

---

## 🧠 Arquitetura (big picture)

```
Next.js (apps/web)
   │
   │ enqueue jobs
   ▼
BullMQ Queue  ← Redis
   │
   ▼
apps/worker
   ├─ Planner (LLM)
   ├─ Generator (LLM)
   ├─ Critic (LLM)
   │
   ▼
Strapi CMS
```

---

## 🧩 Principais Jobs

| Job name         | Descrição                                       |
| ---------------- | ----------------------------------------------- |
| `plan_campaign`  | Cria tasks de conteúdo a partir de uma campanha |
| `generate_task`  | Gera drafts e executa revisão automática        |
| `review_version` | (futuro) Reavalia conteúdo manualmente editado  |

---

## 📦 Estrutura do projeto

```
apps/worker/
  src/
    index.ts              # Entry point do worker
    env.ts                # Validação de variáveis de ambiente
    queue.ts              # BullMQ + Redis
    strapi.ts             # Client Strapi (REST)
    openai.ts             # Client OpenAI (via fetch)
    orchestrator/
      planner.ts          # LLM Planner
      generator.ts        # LLM Generator
      critic.ts           # LLM Critic
      jobs.ts             # Tipos de jobs
  .env.example
  package.json
  tsconfig.json
```

---

## 🔐 Variáveis de ambiente

Crie um `.env` baseado em `.env.example`.

```env
NODE_ENV=development

REDIS_URL=redis://localhost:6379

STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=replace_me

OPENAI_API_KEY=replace_me
OPENAI_MODEL=gpt-4.1-mini

WORKER_CONCURRENCY=5
LOG_LEVEL=info
```

### Observações

* `REDIS_URL` precisa apontar para um Redis acessível
* `STRAPI_TOKEN` deve ter permissão de **write**
* O worker **não funciona sem Redis**

---

## 🚀 Como rodar localmente

### 1️⃣ Subir o Redis

Via Docker (recomendado):

```bash
docker run -d \
  --name redis-content-factory \
  -p 6379:6379 \
  redis:7-alpine
```

Teste:

```bash
docker exec -it redis-content-factory redis-cli ping
# PONG
```

---

### 2️⃣ Preparar o worker

```bash
cd apps/worker
cp .env.example .env
# edite o .env com STRAPI_TOKEN e OPENAI_API_KEY
```

---

### 3️⃣ Rodar em modo dev

```bash
npm install
npm run dev
```

Você deve ver algo como:

```
[worker] starting...
```

---

## 🧪 Enfileirando um job (exemplo)

Via código:

```ts
import { queue } from "./src/queue.js";

await queue.add("plan_campaign", { campaignId: 1 });
```

Ou, normalmente, isso é feito automaticamente pelo `apps/web` ao criar uma campanha.

---

## 🔄 Fluxo de execução (simplificado)

1. Recebe job `plan_campaign`
2. Busca campanha no Strapi
3. Executa LLM Planner
4. Cria `ContentTask`s no CMS
5. Enfileira `generate_task` para cada task
6. Gera drafts
7. Executa revisão automática
8. Salva `ContentVersion` com status:

   * `ready` ou
   * `needs_review`

---

## 🛡 Guardrails e decisões de design

* LLMs **não escrevem direto no CMS final**
* Todo conteúdo passa por **critic automático**
* Erros em uma task **não derrubam a campanha inteira**
* Jobs são idempotentes (planejado)
* Worker é stateless (escala horizontal)

---

## ⚠️ Erros comuns

### `ECONNREFUSED 127.0.0.1:6379`

➡️ Redis não está rodando ou não acessível

### `permission denied /var/run/docker.sock`

➡️ Usuário sem permissão Docker (ver README raiz)

### `OpenAI returned empty content`

➡️ Erro de prompt ou limite de API

---

## 🛣 Roadmap do worker

* [ ] RAG com pgvector
* [ ] Retry + backoff configurável
* [ ] Idempotência por job
* [ ] Observabilidade (logs estruturados)
* [ ] Métricas de custo por campanha
* [ ] DLQ (dead letter queue)

---

## 🧠 Filosofia

> O worker não “cria conteúdo”.
> Ele executa **processos editoriais automatizados**.

Se virar só um loop de prompt → response, algo deu errado.

---

## 📌 Dica final

Se algo falhar:

1. Veja o log do worker
2. Veja o estado no Strapi
3. Veja o job no Redis

**Nunca debuga LLM sem contexto.**


