import { useEffect, useRef, useState } from "react";
import { SignalField } from "@/components/signal-field";
import {
  CHAPTERS,
  COLUMNS,
  EDUCATION,
  INITIAL_COL,
  METRICS,
  NOW_MARK,
  PROFILE,
  RECOGNITION,
  ROLES,
  SKILL_GROUPS,
  STORIES,
  THREADS,
  TOOL_LINES,
  WORDS,
  orgsForSkill,
  threadBox,
  type Metric,
} from "@/data/cv";

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Plus({ large = false }: { large?: boolean }) {
  return <span className={large ? "plus plus-lg" : "plus"} aria-hidden="true" />;
}

function unit(seed: number, i: number) {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function Plate({ seed }: { seed: number }) {
  const w = [0, 1, 2, 3].map((i) => 0.46 + unit(seed, i) * 0.54);
  if (seed % 2 === 0) {
    return (
      <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="640" height="400" fill="#0c0c0b" />
        {Array.from({ length: 18 }, (_, i) => (
          <circle
            key={i}
            cx={36 + i * 32}
            cy="36"
            r={i % 5 === seed % 5 ? 4 : 1.6}
            fill="#f3f3f0"
            opacity={i % 5 === seed % 5 ? 1 : 0.35}
          />
        ))}
        <rect x="32" y="68" width="388" height="300" fill="none" stroke="#2a2a26" />
        <rect x="32" y="68" width="388" height="46" fill="#f3f3f0" />
        <rect x="52" y="140" width={230 * w[0]} height="8" fill="#f3f3f0" />
        <rect x="52" y="160" width={180 * w[1]} height="8" fill="#3f3f3a" />
        <rect x="52" y="180" width={140 * w[2]} height="8" fill="#3f3f3a" />
        <rect x="52" y="220" width="156" height="112" fill="none" stroke="#f3f3f0" />
        <rect x="224" y="220" width="172" height="46" fill="#f3f3f0" />
        <rect x="224" y="278" width={130 * w[3]} height="54" fill="none" stroke="#9a9a94" />
        <rect x="440" y="68" width="168" height="300" fill="none" stroke="#2a2a26" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="460"
            y={96 + i * 50}
            width={128 * w[i % 4]}
            height="8"
            fill={i === seed % 5 ? "#f3f3f0" : "#3f3f3a"}
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="640" height="400" fill="#0c0c0b" />
      <rect x="36" y="36" width="568" height="328" fill="none" stroke="#2a2a26" />
      <path
        d="M36 36h18M36 36v18M604 36h-18M604 36v18M36 364h18M36 364v-18M604 364h-18M604 364v-18"
        stroke="#f3f3f0"
        strokeWidth="1.5"
        fill="none"
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="64" y={78 + i * 96} width="8" height="8" fill="#f3f3f0" />
          <rect x="88" y={74 + i * 96} width={340 * w[i]} height="12" fill="#f3f3f0" />
          <rect x="88" y={98 + i * 96} width={220 * w[(i + 1) % 4]} height="8" fill="#3f3f3a" />
        </g>
      ))}
      <rect x="468" y="74" width="112" height="248" fill="#f3f3f0" />
      <rect x="484" y="94" width="80" height="8" fill="#0c0c0b" />
      <rect x="484" y="114" width="52" height="8" fill="#0c0c0b" opacity="0.4" />
    </svg>
  );
}

function playCount(el: HTMLElement, from: number, to: number) {
  if (motionOff()) {
    el.textContent = String(Math.round(to));
    return;
  }
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / 720);
    const eased = 1 - (1 - p) ** 3;
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function MetricFigure({ metric, play }: { metric: Metric; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !play || played.current) return;
    played.current = true;
    playCount(el, metric.from ?? 0, metric.value);
  }, [play, metric.from, metric.value]);

  return (
    <span className="metric-num">
      {metric.from != null ? (
        <>
          <span className="metric-from">{metric.from}</span>
          <span className="metric-arrow" aria-hidden="true">
            →
          </span>
        </>
      ) : null}
      <span ref={ref}>{metric.value}</span>
      {metric.suffix ? <span className="metric-suffix">{metric.suffix}</span> : null}
    </span>
  );
}

export function Dossier() {
  const [col, setCol] = useState(INITIAL_COL);
  const [chapter, setChapter] = useState(CHAPTERS[0].id);
  const [open, setOpen] = useState<string[]>(["cloudflare"]);
  const [hoverSkill, setHoverSkill] = useState<string | null>(null);
  const [lockSkill, setLockSkill] = useState<string | null>(null);
  const [threadId, setThreadId] = useState(THREADS[0].id);
  const [metricId, setMetricId] = useState<string | null>(null);
  const [seenMetrics, setSeenMetrics] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const lit = lockSkill ?? hoverSkill;
  const activeWord = STORIES[COLUMNS[col].story].word;
  const thread = THREADS.find((item) => item.id === threadId) ?? THREADS[0];
  const allOpen = ROLES.every((role) => open.includes(role.id));

  useEffect(() => {
    const nodes = CHAPTERS.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setChapter(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const p = height > 0 ? window.scrollY / height : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = metricsRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setSeenMetrics(METRICS.map((metric) => metric.id));
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: motionOff() ? "auto" : "smooth",
      block: "start",
    });
  }

  function toggleRole(id: string) {
    setOpen((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function revealRole(id: string) {
    setOpen((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.setTimeout(() => jump(`role-${id}`), 30);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="dossier">
      <div ref={progressRef} className="progress" aria-hidden="true" />
      <a className="skip" href="#signal">
        Skip to content
      </a>

      <header className="nav">
        <button type="button" className="nav-name" onClick={() => jump("signal")}>
          <img src="/linda-mark.png" alt="Linda" />
        </button>
        <nav className="chapters" aria-label="Sections">
          {CHAPTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={chapter === item.id ? "chapter is-on" : "chapter"}
              aria-current={chapter === item.id ? "true" : undefined}
              onClick={() => jump(item.id)}
            >
              <span>{item.index}</span>
              <span className="chapter-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-links">
          <a className="text-link" href={`mailto:${PROFILE.email}`}>
            Mail
          </a>
          <a className="text-link hide-sm" href={PROFILE.portfolio} target="_blank" rel="noreferrer">
            Portfolio
          </a>
          <a className="text-link hide-sm" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </header>

      <main>
        <section id="signal" className="section section-signal">
          <SignalField col={col} onCol={setCol} />

          <div className="poster">
            <p className="kicker poster-kicker">Product designer · AI-native · Physical to digital</p>
            <h1 className="words">
              <span className="sr-only">Linda Lin, product designer. </span>
              {WORDS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={activeWord === item.id ? "word is-on" : "word"}
                  aria-pressed={activeWord === item.id}
                  onClick={() => setCol(item.col)}
                >
                  <span className="word-era">
                    <span className="pip" />
                    0{index + 1} · {item.era}
                  </span>
                  <span className="word-label">{item.label}</span>
                </button>
              ))}
            </h1>
            <p className="summary">{PROFILE.summary}</p>
            <div className="link-row">
              <a className="text-link is-address" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <a className="text-link" href={PROFILE.portfolio} target="_blank" rel="noreferrer">
                Portfolio
              </a>
              <a className="text-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <button type="button" className="text-link" aria-live="polite" onClick={copyEmail}>
                {copied ? "Copied" : "Copy email"}
              </button>
            </div>
          </div>
        </section>

        <section id="now" className="section">
          <div className="marks">
            <Plus large />
            <Plus large />
          </div>
          <p className="kicker">01 — Now</p>
          <h2 className="section-title">Three threads, one practice.</h2>
          <p className="lede">
            School and KADO are still open. The agent work closed in August. The line is today.
          </p>

          <div className="timeline" style={{ ["--now" as string]: `${NOW_MARK}%` }}>
            <div className="timeline-scale">
              <span>Aug 2025</span>
              <span className="scale-now">Now</span>
              <span>May 2027</span>
            </div>
            <div className="tracks">
              {THREADS.map((item) => {
                const box = threadBox(item.start, item.end);
                const on = item.id === thread.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={on ? "thread is-on" : "thread"}
                    aria-pressed={on}
                    onClick={() => setThreadId(item.id)}
                    onMouseEnter={() => setThreadId(item.id)}
                    onFocus={() => setThreadId(item.id)}
                  >
                    <span className="thread-name">{item.name}</span>
                    <span className="thread-org">{item.org}</span>
                    <span className="track">
                      <span
                        className={item.live ? "bar is-live" : "bar"}
                        style={{ left: `${box.left}%`, width: `${box.width}%` }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="thread-detail" key={thread.id}>
              <p className="kicker">{thread.live ? "Live" : "Closed"}</p>
              <p className="thread-detail-title">{thread.org}</p>
              <p className="readout-body">{thread.note}</p>
              {thread.roleId ? (
                <button type="button" className="text-link" onClick={() => revealRole(thread.roleId!)}>
                  Open the entry
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section id="trace" className={lit ? "section is-filtering" : "section"}>
          <div className="marks">
            <Plus large />
            <Plus large />
          </div>
          <div className="section-row">
            <div>
              <p className="kicker">02 — Trace</p>
              <h2 className="section-title">The record, in order.</h2>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => setOpen(allOpen ? [] : ROLES.map((role) => role.id))}
            >
              {allOpen ? "Collapse" : "Expand all"}
            </button>
          </div>
          {lit ? (
            <p className="filter-note">
              Showing {SKILL_GROUPS.flatMap((group) => group.items).find((item) => item.id === lit)?.label}
              {lockSkill ? " · pinned" : ""}
              {lockSkill ? (
                <button type="button" className="text-link" onClick={() => setLockSkill(null)}>
                  Clear
                </button>
              ) : null}
            </p>
          ) : null}

          <div className="roles">
            {ROLES.map((role) => {
              const isOpen = open.includes(role.id);
              const isLit = lit ? role.skills.includes(lit) : false;
              return (
                <article
                  key={role.id}
                  id={`role-${role.id}`}
                  className={isLit ? "role is-lit" : "role"}
                >
                  <h3>
                    <button
                      type="button"
                      className={isOpen ? "role-hit is-open" : "role-hit"}
                      aria-expanded={isOpen}
                      onClick={() => toggleRole(role.id)}
                    >
                      <span className="role-index">{role.index}</span>
                      <span className="role-main">
                        <span className="role-org">{role.org}</span>
                        <span className="role-title">{role.title}</span>
                      </span>
                      <span className="role-when">{role.when}</span>
                      <span className="role-mark">{role.mark}</span>
                      <Plus />
                    </button>
                  </h3>
                  <div className={isOpen ? "role-fold is-open" : "role-fold"}>
                    <div className="role-fold-inner">
                      <div className="stills">
                        {role.frames.map((caption, index) => (
                          <figure key={caption} className="still">
                            <div className="still-frame">
                              <Plate seed={Number(role.index) * 2 + index} />
                            </div>
                            <figcaption>
                              <span>Placeholder</span>
                              <span className="still-name">{caption}</span>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                      <p className="role-story">{role.story}</p>
                      {role.cases ? (
                        <div className="case-row">
                          {role.cases.map((item) => (
                            <a key={item.href} className="text-link" href={item.href} target="_blank" rel="noreferrer">
                              {item.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="scale" className="section">
          <div className="marks">
            <Plus large />
            <Plus large />
          </div>
          <p className="kicker">03 — Scale</p>
          <h2 className="section-title">What actually moved.</h2>
          <p className="lede">Hold a figure. The sentence under it is the work, not the vanity number.</p>
          <div ref={metricsRef} className="metrics">
            {METRICS.map((metric) => {
              const on = metricId === metric.id;
              return (
                <button
                  key={metric.id}
                  type="button"
                  className={on ? "metric is-open" : "metric"}
                  aria-expanded={on}
                  onClick={() => setMetricId(on ? null : metric.id)}
                  onMouseEnter={() => setMetricId(metric.id)}
                  onFocus={() => setMetricId(metric.id)}
                >
                  <MetricFigure metric={metric} play={seenMetrics.includes(metric.id) || on} />
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-note">
                    <span>{metric.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section id="method" className="section">
          <div className="marks">
            <Plus large />
            <Plus large />
          </div>
          <p className="kicker">04 — Method</p>
          <h2 className="section-title">What the work is made of.</h2>
          <p className="lede">
            Touch a line. It pins, and the record above keeps only the roles that used it.
          </p>
          <div className="skill-grid">
            {SKILL_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="kicker skill-group">{group.label}</p>
                <div className="skill-list">
                  {group.items.map((skill) => {
                    const orgs = orgsForSkill(skill.id);
                    const on = lit === skill.id;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        className={on ? "skill is-on" : "skill"}
                        aria-pressed={lockSkill === skill.id}
                        onMouseEnter={() => setHoverSkill(skill.id)}
                        onMouseLeave={() => setHoverSkill(null)}
                        onFocus={() => setHoverSkill(skill.id)}
                        onBlur={() => setHoverSkill(null)}
                        onClick={() => setLockSkill((prev) => (prev === skill.id ? null : skill.id))}
                      >
                        <span>{skill.label}</span>
                        <span className="skill-seen">{orgs.join(" · ")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="tools">
            <p className="kicker">Tools & collaboration</p>
            {TOOL_LINES.map((line) => (
              <p key={line} className="tool-line">
                {line}
              </p>
            ))}
          </div>
        </section>

        <section id="record" className="section">
          <div className="marks">
            <Plus large />
            <Plus large />
          </div>
          <p className="kicker">05 — Record</p>
          <h2 className="section-title">School and recognition.</h2>

          <div className="record-grid">
            <div>
              <p className="kicker record-label">Education</p>
              {EDUCATION.map((item) => (
                <article key={item.school} className="record-item">
                  <p className="record-when">{item.when}</p>
                  <h3 className="record-title">{item.title}</h3>
                  <p className="record-org">{item.school}</p>
                  <p className="readout-body">{item.note}</p>
                </article>
              ))}
            </div>
            <div>
              <p className="kicker record-label">Recognition</p>
              {RECOGNITION.map((item) => (
                <article key={item.title} className="record-item">
                  <p className="record-when">{item.when}</p>
                  <h3 className="record-title">{item.title}</h3>
                  <p className="readout-body">{item.note}</p>
                </article>
              ))}
            </div>
          </div>

          <p className="also">
            Also on the portfolio —{" "}
            <a className="inline-link" href="https://linda-in-design.framer.website/projects/llm-as-tutor" target="_blank" rel="noreferrer">
              LLM as Tutor
            </a>
            . Not a job. A study in how guidance should feel.
          </p>

          <footer className="footer">
            <div>
              <p className="footer-name">Linda Lin</p>
              <p className="readout-body">
                {PROFILE.location}. M.S. expected May 2027. English & Mandarin.
              </p>
            </div>
            <div className="footer-links">
              <a className="text-link is-address" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <a className="text-link" href={PROFILE.portfolio} target="_blank" rel="noreferrer">
                Portfolio
              </a>
              <a className="text-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
