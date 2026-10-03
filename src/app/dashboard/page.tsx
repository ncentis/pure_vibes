"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "@/components/glassbox/glassbox.module.css";
import { glassboxFonts } from "@/components/glassbox/fonts";
import { TopBar } from "@/components/glassbox/top-bar";
import { MOCK_REVIEWS } from "@/components/glassbox/mock";

// Home (Figma 9:32): start a new project by connecting a tool, with prior
// projects on the right. Tool connection is mocked — Continue starts the
// demo review; real agent-key handshake comes with Nick's MCP work.

const TOOLS = [
  {
    id: "apple-02",
    label: "Apple Intelligence",
    src: "/tools/apple-intelligence-02.svg",
  },
  { id: "perplexity", label: "Perplexity", src: "/tools/perplexity.svg" },
  {
    id: "apple-04",
    label: "Apple Intelligence",
    src: "/tools/apple-intelligence-04.svg",
  },
  { id: "grok", label: "Grok", src: "/tools/grok.svg" },
  { id: "claude", label: "Claude", src: "/tools/claude.svg" },
  { id: "chatgpt", label: "ChatGPT", src: "/tools/chatgpt.svg" },
];

export default function DashboardPage() {
  const [tool, setTool] = useState<string | null>(null);
  const projects = Object.values(MOCK_REVIEWS);

  return (
    <div className={`${styles.page} ${glassboxFonts}`}>
      <TopBar />
      <div className={styles.alignShell}>
        <div className={styles.alignLayout}>
          <div>
            <h1 className={styles.homeHeader}>
              Let&apos;s get started with a new project
            </h1>
            <div className={styles.connectCard}>
              <p className={styles.connectLabel}>connect with your tool</p>
              <div className={styles.toolRow}>
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={t.label}
                    aria-pressed={tool === t.id}
                    className={`${styles.toolBtn} ${
                      tool === t.id ? styles.toolBtnActive : ""
                    }`}
                    onClick={() => setTool(tool === t.id ? null : t.id)}
                  >
                    <Image src={t.src} alt="" width={40} height={40} />
                  </button>
                ))}
              </div>
              <Link href="/approve/demo-wine" className={styles.miniCta}>
                Continue
              </Link>
            </div>
          </div>

          <div>
            <p className={styles.projectsTitle}>Prior Projects</p>
            <div className={styles.projectList}>
              {projects.map((r) => (
                <Link
                  key={r.id}
                  href={`/approve/${r.id}`}
                  className={styles.reviewLink}
                >
                  <div className={styles.projectTile}>
                    <span className={styles.projectDate}>
                      {new Date(r.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className={styles.projectName}>{r.task}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
