import { notFound } from "next/navigation";
import styles from "@/components/glassbox/glassbox.module.css";
import { AlignmentForm } from "@/components/glassbox/alignment-form";
import { glassboxFonts } from "@/components/glassbox/fonts";
import { MOCK_REVIEWS } from "@/components/glassbox/mock";

// Alignment page. The brief calls this /align/[id]; it lives under /approve
// per file ownership — alias or rename is a one-line follow-up with Nick.
// Data is mocked until /api/review + Supabase land; try /approve/demo-wine
// and /approve/demo-quiz.

export default async function AlignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = MOCK_REVIEWS[id];
  if (!review) notFound();

  return (
    <div className={`${styles.page} ${glassboxFonts}`}>
      <div className={styles.shell}>
        <div className={styles.brand}>Glass Box</div>
        <h1 className={styles.taskHeader}>
          Here is how <em>i</em> want to approach it
        </h1>
        <p className={styles.agentName}>
          {review.agent_name} · “{review.task}”
        </p>
        <AlignmentForm review={review} />
      </div>
    </div>
  );
}
