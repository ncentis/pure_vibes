"use client";

import { useState } from "react";
import styles from "./glassbox.module.css";
import { PlusIcon } from "./plus-icon";
import { PriorityList, type RankedItem } from "./priority-list";
import {
  DIAL_SPECS,
  type DialKey,
  type HardLine,
  type MockReview,
} from "./mock";

interface AlignmentFormProps {
  review: MockReview;
}

export function AlignmentForm({ review }: AlignmentFormProps) {
  const [ranking, setRanking] = useState<RankedItem[]>(
    review.initial_ranking.map((name) => ({ name })),
  );
  const [dials, setDials] = useState<Record<DialKey, number>>(review.dials);
  const [hardLines, setHardLines] = useState<HardLine[]>(review.hard_lines);
  const [budget, setBudget] = useState(review.budget_cents / 100);
  const [submitted, setSubmitted] = useState(false);
  const [savedDefault, setSavedDefault] = useState(false);

  const inRanking = new Set(ranking.map((r) => r.name));

  function addSuggestion(name: string) {
    if (inRanking.has(name)) return;
    setRanking([{ name, addedByHuman: true }, ...ranking]);
  }

  function toggleHardLine(key: string) {
    setHardLines(
      hardLines.map((h) => (h.key === key ? { ...h, enabled: !h.enabled } : h)),
    );
  }

  function handleSubmit() {
    // TODO(wiring): call approve_review via Supabase once Nick's API lands.
    // Payload shape matches the priority contract in the project brief.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.confirm}>
        <div className={styles.confirmMark}>✓</div>
        <h2 className={styles.confirmTitle}>Sent to {review.agent_name}</h2>
        <p className={styles.confirmSub}>
          It will replan around your priorities and check in before anything
          risky.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.alignLayout}>
      <div>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Stated vs. revealed</h2>
          <p className={styles.cardHint}>
            What it says it cares about. What its plan actually does.
          </p>
          <div className={styles.svr}>
            <div className={styles.svrRow}>
              <span className={styles.svrLabel}>Agent says</span>
              <span className={styles.svrStated}>
                {review.stated.join(" · ")}
              </span>
            </div>
            {review.revealed.map((r) => (
              <div
                key={r.name}
                className={`${styles.svrRow} ${styles.svrRowDrift}`}
              >
                <span className={styles.svrLabel}>Plan does</span>
                <span className={styles.svrRevealed}>{r.name}</span>
                <span className={styles.svrEvidence}>{r.evidence}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Your priorities</h2>
          <p className={styles.cardHint}>
            Drag to reorder. #1 wins every conflict. Tap a tile to remove it.
          </p>
          <PriorityList items={ranking} onChange={setRanking} />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Dials</h2>
          {DIAL_SPECS.map((d) => (
            <div key={d.key} className={styles.dialRow}>
              <div className={styles.dialLabels}>
                <span
                  className={dials[d.key] <= 0.5 ? styles.dialLabelActive : ""}
                >
                  {d.low}
                </span>
                <span
                  className={dials[d.key] > 0.5 ? styles.dialLabelActive : ""}
                >
                  {d.high}
                </span>
              </div>
              <input
                type="range"
                className={styles.dialInput}
                min={0}
                max={1}
                step={0.05}
                value={dials[d.key]}
                aria-label={`${d.low} versus ${d.high}`}
                onChange={(e) =>
                  setDials({ ...dials, [d.key]: Number(e.target.value) })
                }
              />
            </div>
          ))}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Hard lines</h2>
          <p className={styles.cardHint}>
            These won&apos;t be crossed. No matter what.
          </p>
          <div className={styles.hardList}>
            {hardLines.map((h) => (
              <div key={h.key} className={styles.hardRow}>
                <p className={styles.hardLabel}>{h.label}</p>
                {h.key === "budget_max" && h.enabled ? (
                  <span className={styles.budgetRow}>
                    <span>$</span>
                    <input
                      type="number"
                      className={styles.budgetInput}
                      min={0}
                      value={budget}
                      aria-label="Budget max in dollars"
                      onChange={(e) => setBudget(Number(e.target.value))}
                    />
                  </span>
                ) : null}
                <button
                  type="button"
                  role="switch"
                  aria-checked={h.enabled}
                  aria-label={h.label}
                  className={`${styles.toggle} ${h.enabled ? styles.toggleOn : ""}`}
                  onClick={() => toggleHardLine(h.key)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className={styles.sideSticky}>
        <div className={styles.optCard}>
          <p className={styles.optCardTitle}>Worth adding</p>
          <div className={styles.optList}>
            {review.suggestions.map((s) => {
              const added = inRanking.has(s.name);
              const rowClasses = [
                styles.optRow,
                s.severity === "critical" ? styles.optRowCritical : "",
                added ? styles.optRowAdded : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={s.name}
                  type="button"
                  className={rowClasses}
                  onClick={() => addSuggestion(s.name)}
                  disabled={added}
                >
                  <PlusIcon className={styles.sugChipIcon} />
                  <span className={styles.optRowBody}>
                    <span>
                      {s.name}
                      {added ? " · added" : ""}
                    </span>
                    <span className={styles.optRowReason}>{s.reason}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {review.cost_before !== "—" && (
          <div className={styles.optCard}>
            <p className={styles.optCardTitle}>Estimated cost</p>
            <div className={styles.cost}>
              <span className={styles.costBefore}>{review.cost_before}</span>
              <span className={styles.costArrow}>→</span>
              <span className={styles.costAfter}>{review.cost_after}</span>
            </div>
          </div>
        )}

        <div className={styles.submitBar}>
          <button
            type="button"
            className={styles.submit}
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => setSavedDefault(true)}
        >
          {savedDefault ? "Saved as default ✓" : "Save as default"}
        </button>
      </aside>
    </div>
  );
}
