import { chat } from "../openai.js";

export async function runGenerator(input: {
  task: { channel: string; format: string; brief: string };
  campaign: { name: string; objective: string; persona?: string | null };
}) {
  const { task, campaign } = input;

  const prompt = `
Crie um rascunho de conteúdo.
Contexto:
- Campanha: ${campaign.name}
- Objetivo: ${campaign.objective}
- Persona: ${campaign.persona ?? "n/a"}

Task:
- channel: ${task.channel}
- format: ${task.format}
- brief: ${task.brief}

Retorne APENAS JSON:
{
  "title": "...",
  "body": "...",
  "metadata": { "cta": "...", "keywords": ["..."] }
}
`.trim();

  const out = await chat(
    [
      { role: "system", content: "Responda somente com JSON válido. Sem markdown." },
      { role: "user", content: prompt }
    ],
    { temperature: 0.7 }
  );

  return JSON.parse(out) as { title: string; body: string; metadata: any };
}
