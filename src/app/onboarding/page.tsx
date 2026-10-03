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
              {/* TODO(wiring): supabase.auth.signInWithOAuth — George's lane.
                  Mock: advances the flow. */}
              <div className={styles.oauthStack}>
                <button
                  type="button"
                  className={styles.oauthBtn}
                  onClick={() => setStep(1)}
                >
                  <svg
                    className={styles.oauthIcon}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      fill="#4285F4"
                      d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.28a7.21 7.21 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  className={styles.oauthBtn}
                  onClick={() => setStep(1)}
                >
                  <svg
                    className={styles.oauthIcon}
                    viewBox="0 0 16 16"
                    aria-hidden
                  >
                    <path
                      fill="#000"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                    />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
              <div className={styles.divider}>or</div>
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
