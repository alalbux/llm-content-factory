import { chat } from "../openai.js";

export async function runCritic(input: { title: string; body: string }) {
  const prompt = `
Você é um revisor crítico. Avalie qualidade, clareza e risco.
Retorne APENAS JSON:
{
  "score": 0-100,
  "decision": "approve" | "needs_review",
  "issues": [{ "type": "clarity|brand|factual|generic", "detail": "..." }],
  "suggested_fix": "..."
}

Conteúdo:
TITLE: ${input.title}
BODY: ${input.body}
`.trim();

  const out = await chat(
    [
      { role: "system", content: "Seja rigoroso. Responda somente com JSON válido. Sem markdown." },
      { role: "user", content: prompt }
    ],
    { temperature: 0.2 }
  );

  return JSON.parse(out) as {
    score: number;
    decision: "approve" | "needs_review";
    issues: Array<{ type: string; detail: string }>;
    suggested_fix?: string;
  };
}
