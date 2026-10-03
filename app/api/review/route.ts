import { z } from "zod";
import { revealAndCritique } from "@/lib/llm";
import { admin, hasSupabase } from "@/lib/supabase/admin";

export const maxDuration = 60;

const Body = z.object({
  task: z.string().min(1),
  plan: z.string().min(1),
  agent_name: z.string().default("unknown agent"),
  user_id: z.string().uuid().optional(),
});

// POST /api/review — Reveal + Critique. Persists the review when Supabase is configured.
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const { task, plan, agent_name, user_id } = parsed.data;

  const started = Date.now();
  const { revealed, critique } = await revealAndCritique({ task, plan });
  const ms = Date.now() - started;

  let review_id: string | null = null;
  if (hasSupabase() && user_id) {
    const { data, error } = await admin()
      .from("reviews")
      .insert({ user_id, agent_name, task, plan, revealed, critique, status: "pending" })
      .select("id")
      .single();
    if (error) return Response.json({ error: error.message, revealed, critique }, { status: 500 });
    review_id = data.id;
  }

  return Response.json({ review_id, revealed, critique, ms });
}
