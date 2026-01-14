# Architecture

## High-level components

The system is composed of five main parts:

1. **Web (Next.js)**
   - Admin UI
   - Public and internal APIs
   - Job enqueueing

2. **CMS (Strapi)**
   - Editorial source of truth
   - Versioned content
   - Publishing and scheduling

3. **Worker**
   - Background orchestration
   - LLM interactions
   - Async job execution

4. **Infrastructure**
   - Redis (queues)
   - Postgres (data + vectors)
   - Docker (local orchestration)

5. **Shared package**
   - Types and schemas
   - Contracts between services

---

## Design principles

- CMS does not run business logic
- Workers are stateless
- LLMs are isolated behind roles
- All side effects are explicit
- Human review is always possible

---

## Why this architecture?

This design favors:
- debuggability
- gradual automation
- controlled failure modes
- long-term maintainability
