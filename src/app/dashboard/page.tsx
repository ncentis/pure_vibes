import Link from "next/link";
import styles from "@/components/glassbox/glassbox.module.css";
import { glassboxFonts } from "@/components/glassbox/fonts";
import { TopBar } from "@/components/glassbox/top-bar";
import { MOCK_EVENTS, MOCK_REVIEWS } from "@/components/glassbox/mock";

// Big-screen live feed. Mocked for now; will subscribe to Supabase Realtime
// on `reviews` and `events` and auto-jump to new /align pages once wired.

const DOT_CLASS: Record<string, string> = {
  drift: styles.feedDotDrift,
  breach: styles.feedDotBreach,
};

export default function DashboardPage() {
  const reviews = Object.values(MOCK_REVIEWS);
  const events = [...MOCK_EVENTS].reverse();

  return (
    <div className={`${styles.page} ${glassboxFonts}`}>
      <TopBar />
      <div className={styles.shellWide}>
        <div className={styles.statRow}>
          <div className={styles.stat}>
            <p className={styles.statValue}>{reviews.length}</p>
            <p className={styles.statLabel}>Reviews</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statValue}>
              {events.filter((e) => e.type === "breach").length}
            </p>
            <p className={styles.statLabel}>Hard lines blocked</p>
          </div>
          <div className={styles.stat}>
            <p className={`${styles.statValue} ${styles.statSaved}`}>$40/mo</p>
            <p className={styles.statLabel}>Alignment saved you</p>
          </div>
        </div>

        <section>
          <h2 className={styles.cardTitle}>Reviews</h2>
          <div className={styles.feed}>
            {reviews.map((r) => (
              <Link
                key={r.id}
                href={`/approve/${r.id}`}
                className={styles.reviewLink}
              >
                <div className={styles.reviewCard}>
                  <span
                    className={`${styles.pill} ${
                      r.status === "approved"
                        ? styles.pillApproved
                        : styles.pillPending
                    }`}
                  >
                    {r.status}
                  </span>
                  <h3 className={styles.feedAction} style={{ marginTop: 8 }}>
                    {r.task}
                  </h3>
                  <p className={styles.feedDetail}>
                    {r.agent_name} · revealed #1: {r.revealed[0]?.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.sectionGap}>
          <h2 className={styles.cardTitle}>Event feed</h2>
          <div className={styles.feed}>
            {events.map((e) => (
              <div
                key={e.id}
                className={`${styles.feedItem} ${
                  e.type === "breach" ? styles.feedBreach : ""
                }`}
              >
                <span
                  className={`${styles.feedDot} ${DOT_CLASS[e.type] ?? ""}`}
                />
                <div style={{ flex: 1 }}>
                  <p className={styles.feedAction}>{e.action}</p>
                  <p className={styles.feedDetail}>{e.detail}</p>
                </div>
                <span className={styles.feedTime}>
                  {new Date(e.created_at).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
