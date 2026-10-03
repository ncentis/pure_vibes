"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/components/glassbox/glassbox.module.css";
import {
  PriorityList,
  type RankedItem,
} from "@/components/glassbox/priority-list";
import { glassboxFonts } from "@/components/glassbox/fonts";
import { TopBar } from "@/components/glassbox/top-bar";
import {
  DIAL_SPECS,
  MOCK_PROFILE,
  PROFILE_VALUE_CATALOG,
  type DialKey,
  type HardLine,
} from "@/components/glassbox/mock";

// Saved defaults: ranking, dials, hard lines. Pre-fills every new alignment
// page. Mocked until profiles are wired to Supabase.

export default function ProfilePage() {
  const [ranking, setRanking] = useState<RankedItem[]>(
    MOCK_PROFILE.ranking_defaults.map((name) => ({ name })),
  );
  const [dials, setDials] = useState<Record<DialKey, number>>(
    MOCK_PROFILE.dials,
  );
  const [hardLines, setHardLines] = useState<HardLine[]>(
    MOCK_PROFILE.hard_lines,
  );
  const [saved, setSaved] = useState(false);

  const inRanking = new Set(ranking.map((r) => r.name));

  function addValue(name: string) {
    if (inRanking.has(name)) return;
    setRanking([...ranking, { name }]);
  }

  return (
    <div className={`${styles.page} ${glassboxFonts}`}>
      <TopBar />
      <div className={styles.alignShell}>
        <h1 className={styles.taskHeader}>
          What <em>i</em> always care about
        </h1>
        <p className={styles.agentName}>
          Every new alignment starts from these. Next time, it already knows.
        </p>

        <div className={styles.alignLayout}>
          <div>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Default ranking</h2>
              <PriorityList items={ranking} onChange={setRanking} />
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Dials</h2>
              {DIAL_SPECS.map((d) => (
                <div key={d.key} className={styles.dialRow}>
                  <div className={styles.dialLabels}>
                    <span
                      className={
                        dials[d.key] <= 0.5 ? styles.dialLabelActive : ""
                      }
                    >
                      {d.low}
                    </span>
                    <span
                      className={
                        dials[d.key] > 0.5 ? styles.dialLabelActive : ""
                      }
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
              <div className={styles.hardList}>
                {hardLines.map((h) => (
                  <div key={h.key} className={styles.hardRow}>
                    <p className={styles.hardLabel}>{h.label}</p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={h.enabled}
                      aria-label={h.label}
                      className={`${styles.toggle} ${h.enabled ? styles.toggleOn : ""}`}
                      onClick={() =>
                        setHardLines(
                          hardLines.map((x) =>
                            x.key === h.key ? { ...x, enabled: !x.enabled } : x,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.sideSticky}>
            <div className={styles.optCard}>
              <p className={styles.optCardTitle}>
                Additional optional values you may add
              </p>
              <div className={styles.optList}>
                {PROFILE_VALUE_CATALOG.map((name) => {
                  const added = inRanking.has(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      className={`${styles.optRow} ${added ? styles.optRowAdded : ""}`}
                      onClick={() => addValue(name)}
                      disabled={added}
                    >
                      <span className={styles.sugChipIcon} aria-hidden>
                        +
                      </span>
                      <span className={styles.optRowBody}>
                        <span>
                          {name}
                          {added ? " · added" : ""}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.submitBar}>
              <Link
                href="/dashboard"
                className={`${styles.submit} ${styles.submitLink}`}
              >
                Continue
              </Link>
            </div>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setSaved(true)}
            >
              {saved ? "Saved defaults ✓" : "Save defaults"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
