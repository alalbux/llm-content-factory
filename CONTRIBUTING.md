# Contributing to LLM Content Factory

Thanks for your interest in contributing! 🎉  
This project welcomes contributions that improve **quality, clarity, reliability, and learning**.

LLM Content Factory is not a demo project — it aims to be a **production-grade system**. Please keep that in mind when contributing.

---

## 🧠 Guiding principles

Before opening a PR, ask yourself:

- Does this improve correctness, clarity, or reliability?
- Does this make the system more observable or controllable?
- Does this reduce hidden magic or accidental complexity?

We value:
- explicit design
- boring-but-reliable solutions
- documentation alongside code

---

## 🧩 What you can contribute

Some good contribution ideas:

- Improve prompts (Planner / Generator / Critic)
- Add new background jobs or workflows
- Improve RAG logic or vector indexing
- Improve observability, logging, or error handling
- Improve documentation (README, docs, diagrams)
- Fix bugs or edge cases
- Improve developer experience (Makefile, Docker, scripts)

---

## 🚀 Getting started

1. Fork the repository
2. Clone your fork
3. Run the project locally:

```bash
make dev
```

Create a branch:

git checkout -b feat/my-change
🧪 Development guidelines
Prefer small, focused commits

Avoid mixing refactors with behavior changes

Add comments where design decisions are not obvious

Avoid introducing framework-specific code into packages/shared

Keep workers stateless and idempotent where possible

🧾 Commit message convention (recommended)
type(scope): short description

Examples:
feat(worker): add retry policy for generate_task
fix(shared): validate job payload with zod
docs(readme): clarify local setup instructions
📦 Pull Requests
When opening a PR, please include:

What problem this solves

Why this approach was chosen

Any trade-offs or known limitations

If the change affects architecture or workflow, update the docs.

❌ What not to do
Don’t add “magic” behavior without documentation

Don’t silently change contracts in packages/shared

Don’t auto-publish content without guardrails

Don’t assume LLMs are deterministic

🤝 Code of Conduct
By participating in this project, you agree to abide by the Code of Conduct.