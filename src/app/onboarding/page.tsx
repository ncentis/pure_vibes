"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/components/glassbox/glassbox.module.css";
import { glassboxFonts } from "@/components/glassbox/fonts";
import { TopBar } from "@/components/glassbox/top-bar";
import {
  PriorityList,
  type RankedItem,
} from "@/components/glassbox/priority-list";
import { MOCK_PROFILE, type HardLine } from "@/components/glassbox/mock";

// Account-creation onboarding, UI only. Three steps: account -> default
// priorities -> hard lines, then confirmation. Mock state throughout —
// wiring to Supabase Auth is George's lane (src/app/auth); this flow just
// hands off the collected defaults.

const STEP_COUNT = 3;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ranking, setRanking] = useState<RankedItem[]>(
    MOCK_PROFILE.ranking_defaults.map((name) => ({ name })),
  );
  const [hardLines, setHardLines] = useState<HardLine[]>(
    MOCK_PROFILE.hard_lines,
  );
  const [budget, setBudget] = useState(MOCK_PROFILE.budget_cents / 100);

  const accountValid = email.includes("@") && password.length >= 8;

  function toggleHardLine(key: string) {
    setHardLines(
      hardLines.map((h) => (h.key === key ? { ...h, enabled: !h.enabled } : h)),
    );
  }

  const dots = (
    <div className={styles.stepDots} aria-hidden>
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <span
          key={i}
          className={`${styles.stepDot} ${i === step ? styles.stepDotActive : ""}`}
        />
      ))}
    </div>
  );

  return (
    <div className={`${styles.page} ${glassboxFonts}`}>
      <TopBar minimal />
      <div className={styles.onboardShell}>
        {step === 0 && (
          <>
            <p className={styles.stepLabel}>Step 1 of 3</p>
            <h1 className={`${styles.taskHeader} ${styles.pretty}`}>
              Here is how <em>we</em> will get you started
            </h1>
            <p className={styles.agentName}>
              Create your account — your agents will answer to it.
            </p>
            <div className={styles.onboardCard}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="ob-email">
                  Email
                </label>
                <input
                  id="ob-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.co"
                  className={styles.fieldInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="ob-password">
                  Password
                </label>
                <input
                  id="ob-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className={styles.fieldInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                className={styles.submit}
                disabled={!accountValid}
                onClick={() => setStep(1)}
              >
                Create account
              </button>
            </div>
            {dots}
          </>
        )}

        {step === 1 && (
          <>
            <p className={styles.stepLabel}>Step 2 of 3</p>
            <h1 className={`${styles.taskHeader} ${styles.pretty}`}>
              What do <em>you</em> always care about
            </h1>
            <p className={styles.agentName}>
              Drag to order. Every agent inherits this on every task.
            </p>
            <PriorityList items={ranking} onChange={setRanking} />
            <div className={styles.onboardFooter}>
              <button
                type="button"
                className={styles.submit}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
              <button
                type="button"
                className={styles.backLink}
                onClick={() => setStep(0)}
              >
                Back
              </button>
            </div>
            {dots}
          </>
        )}

        {step === 2 && (
          <>
            <p className={styles.stepLabel}>Step 3 of 3</p>
            <h1 className={`${styles.taskHeader} ${styles.pretty}`}>
              Where is your hard line
            </h1>
            <p className={styles.agentName}>
              These can never be crossed, no matter the ranking.
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
            <div className={styles.onboardFooter}>
              <button
                type="button"
                className={styles.submit}
                onClick={() => setStep(3)}
              >
                Finish setup
              </button>
              <button
                type="button"
                className={styles.backLink}
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </div>
            {dots}
          </>
        )}

        {step === 3 && (
          <div className={styles.confirm}>
            <div className={styles.confirmMark}>✓</div>
            <h2 className={styles.confirmTitle}>You&apos;re in</h2>
            <p className={styles.confirmSub}>
              Connect an agent and it will see exactly what you care about.
            </p>
            <div className={styles.onboardFooter}>
              <Link
                href="/dashboard"
                className={`${styles.submit} ${styles.submitLink}`}
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
