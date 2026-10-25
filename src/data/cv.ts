export const PROFILE = {
  name: "Linda Lin",
  email: "cl54428@eid.utexas.edu",
  location: "Austin, TX",
  portfolio: "https://linda-in-design.framer.website/",
  linkedin: "https://www.linkedin.com/in/linda-lin-design/",
  summary:
    "Seven years, from objects to interfaces to agents. An LLM agent at Cloudflare through August 2026, and a marketplace as founding designer. Before that: 270+ sites a year, and a transit app for two million people a day.",
} as const;

export const FIELD_COLS = 24;
export const FIELD_ROWS = 8;

export type StoryId = "material" | "synology" | "austin" | "agent";
export type OverlayId = "metro" | "kado";

export type Column = {
  label: string;
  story: StoryId;
  overlay?: OverlayId;
};

export const COLUMNS: Column[] = [
  { label: "2018", story: "material" },
  { label: "2019", story: "material" },
  { label: "2019", story: "material" },
  { label: "2020", story: "material" },
  { label: "2021", story: "material" },
  { label: "2021", story: "synology" },
  { label: "2022", story: "synology" },
  { label: "2022", story: "synology" },
  { label: "2023", story: "synology", overlay: "metro" },
  { label: "2023", story: "synology", overlay: "metro" },
  { label: "2023", story: "synology", overlay: "metro" },
  { label: "2024", story: "synology" },
  { label: "2025", story: "synology" },
  { label: "2025", story: "austin" },
  { label: "2025", story: "austin" },
  { label: "2025", story: "austin", overlay: "kado" },
  { label: "2026", story: "austin", overlay: "kado" },
  { label: "2026", story: "agent", overlay: "kado" },
  { label: "2026", story: "agent", overlay: "kado" },
  { label: "2026", story: "agent", overlay: "kado" },
  { label: "NOW", story: "agent", overlay: "kado" },
  { label: "NOW", story: "agent", overlay: "kado" },
  { label: "NOW", story: "agent", overlay: "kado" },
  { label: "NOW", story: "agent", overlay: "kado" },
];

export const INITIAL_COL = FIELD_COLS - 1;

type Story = {
  id: StoryId;
  kicker: string;
  title: string;
  body: string;
  word: "physical" | "pixels" | "prompts";
};

export const STORIES: Record<StoryId, Story> = {
  material: {
    id: "material",
    kicker: "2018 — 2021",
    title: "Industrial & CMF",
    body: "Electronics, mobility, luggage. Color, material, finish — Clevo, NOVA, and others. Objects, before interfaces.",
    word: "physical",
  },
  synology: {
    id: "synology",
    kicker: "2021 — 2025",
    title: "Synology",
    body: "Design coordinator. 270+ sites a year, six subsidiaries, a hundred stakeholders. Satisfaction moved from 82 to 89. A tutorial hub whose visitors grew 73×, then a guide so other teams could repeat it.",
    word: "pixels",
  },
  austin: {
    id: "austin",
    kicker: "2025 — 2026",
    title: "UT Austin",
    body: "The UX track. A semester of human–robot research, then UX lead on UT MarketPlace. Accessibility, taken to WCAG 2.1 AA.",
    word: "pixels",
  },
  agent: {
    id: "agent",
    kicker: "Jun — Aug 2026",
    title: "Cloudflare",
    body: "First designer on the AI agent. Three features shipped before August: enterprise beta, the agent label, and a state that separates the answer from the reasoning. About 10,000 prompts, read for intent.",
    word: "prompts",
  },
};

export const OVERLAYS: Record<OverlayId, { kicker: string; title: string; body: string }> = {
  metro: {
    kicker: "Also in 2023",
    title: "Metro Taipei",
    body: "A transit app, two million people a day. Research, the journey, the interface. The rating rose 15.8%. Synology kept going beside it.",
  },
  kado: {
    kicker: "Still running",
    title: "KADO",
    body: "Founding designer. Buyer and seller, from an ambiguous brief to a prototype the team could build.",
  },
};

export const WORDS = [
  { id: "physical" as const, label: "Physical", era: "2018—21", col: 2 },
  { id: "pixels" as const, label: "Pixels", era: "2021—25", col: 9 },
  { id: "prompts" as const, label: "Prompts", era: "2026", col: INITIAL_COL },
];

export function hash(col: number, row: number) {
  const x = Math.sin(col * 127.1 + row * 311.7 + 19.19) * 43758.5453123;
  return x - Math.floor(x);
}

export type DotKind = "ship" | "trace" | "ghost";

export function dotKind(col: number, row: number): DotKind {
  const column = COLUMNS[col];
  const n = hash(col, row);
  let p = 0.16;
  if (column.story === "material") p = 0.15;
  if (column.story === "synology") p = 0.28;
  if (column.overlay === "metro") p = 0.42;
  if (column.story === "austin") p = 0.2;
  if (column.story === "agent") p = 0.36;
  const mid = 1 - Math.abs(row - 3.2) / 6;
  p *= 0.72 + mid * 0.45;
  if (n < p * 0.48) return "ship";
  if (n < 0.82) return "trace";
  return "ghost";
}

export function shipCount() {
  let n = 0;
  for (let c = 0; c < FIELD_COLS; c++) {
    for (let r = 0; r < FIELD_ROWS; r++) {
      if (dotKind(c, r) === "ship") n += 1;
    }
  }
  return n;
}

export type Role = {
  id: string;
  index: string;
  org: string;
  title: string;
  when: string;
  mark: string;
  story: string;
  frames: [string, string];
  skills: string[];
  cases?: { label: string; href: string }[];
};

const P = "https://linda-in-design.framer.website/projects";

export const ROLES: Role[] = [
  {
    id: "cloudflare",
    index: "01",
    org: "Cloudflare",
    title: "Product Design Intern, AI Agent Experience",
    when: "Jun 2026 — Aug 2026",
    mark: "3 shipped",
    skills: ["hai", "agent", "research", "proto"],
    cases: [{ label: "Agent experience", href: `${P}/cloudflare-ai-agent-design` }],
    frames: ["Enterprise beta", "Answer and reasoning"],
    story:
      "June to August 2026, the agent team’s first design intern. Three features shipped on the Dashboard: an enterprise beta, the agent label, and a finalizing-response state that keeps the answer separate from the reasoning. Three more explorations reached engineering — quick actions while the agent responds, pointing at the interface instead of describing it, and layouts for sub-agents. About 10,000 prompts, and a small eval setup, were how intent got checked.",
  },
  {
    id: "kado",
    index: "02",
    org: "KADO",
    title: "Founding Product Designer",
    when: "Dec 2025 — Present",
    mark: "MVP",
    skills: ["ia", "proto", "vibe"],
    frames: ["Buyer", "Seller"],
    story:
      "Founding designer from December 2025. Buyer and seller flows — the architecture, the wireframes, the high-fidelity UI — drawn with the founders and engineers. Claude, Figma Make, and Lovable carried the jumps from an ambiguous brief to a prototype people could react to.",
  },
  {
    id: "access",
    index: "03",
    org: "UT Austin iSchool",
    title: "IT & Web Accessibility Assistant",
    when: "Feb 2026 — Jun 2026",
    mark: "10+ sites",
    skills: ["a11y"],
    frames: ["The audit", "The fix"],
    story:
      "February to June 2026. Ten-plus faculty sites audited and fixed to WCAG 2.1 AA, in GitHub and WordPress: semantic HTML, ARIA, contrast, keyboard, and a note of how to keep doing it.",
  },
  {
    id: "hri",
    index: "04",
    org: "UT Austin iSchool",
    title: "Research Assistant, Human–Robot Interaction",
    when: "Aug 2025 — Dec 2025",
    mark: "HRI",
    skills: ["hai", "research"],
    frames: ["The study", "The interaction"],
    story:
      "Fall 2025, beside faculty on human–robot research. Interaction design, then the quieter work of actually running the studies.",
  },
  {
    id: "synology",
    index: "05",
    org: "Synology",
    title: "Design Coordinator, UX & DesignOps",
    when: "Apr 2021 — Jul 2025",
    mark: "270+ / yr",
    skills: ["systems", "ia", "data", "a11y"],
    cases: [
      { label: "Design guide", href: `${P}/004-web` },
      { label: "Tutorial hub", href: `${P}/003-web` },
      { label: "GA4 practice", href: `${P}/002-data-analytics` },
    ],
    frames: ["Tutorial hub", "Design guide"],
    story:
      "April 2021 to July 2025. End-to-end UX for 270+ sites a year, six subsidiaries, a hundred stakeholders — satisfaction from 82% to 89%. The tutorial hub, rebuilt around search, filters, and a clearer architecture, drew 73× the visitors. GA4, Hotjar, and Mouseflow stayed in the loop. The design guide is what let other teams repeat it.",
  },
  {
    id: "metro",
    index: "06",
    org: "Metro Taipei",
    title: "UX Designer, Contract",
    when: "Apr 2023 — Oct 2023",
    mark: "+15.8%",
    skills: ["research", "proto", "ia"],
    cases: [{ label: "Go app", href: `${P}/001-app` }],
    frames: ["The journey", "The app"],
    story:
      "April to October 2023, on a transit app used by two million people a day. Research, journey maps, a responsive interface. The store rating rose 15.8%.",
  },
  {
    id: "earlier",
    index: "07",
    org: "Earlier practice",
    title: "Industrial & CMF Designer",
    when: "2018 — 2021",
    mark: "Objects",
    skills: ["craft"],
    cases: [
      { label: "Laptop CMF", href: `${P}/006-laptop-cmf` },
      { label: "Steam pot", href: `${P}/005-smokefree-steam-pot` },
    ],
    frames: ["Material", "The object"],
    story:
      "2018 to 2021. Color, material, finish for electronics, mobility, and luggage — Clevo, NOVA Design, Fubon, a studio in New York. The reason the digital work still cares how a thing feels in the hand.",
  },
];

export type Thread = {
  id: string;
  name: string;
  org: string;
  start: string;
  end: string;
  live: boolean;
  roleId?: string;
  note: string;
};

export const THREADS: Thread[] = [
  {
    id: "agent",
    name: "Agent",
    org: "Cloudflare",
    start: "2026-06",
    end: "2026-09",
    live: false,
    roleId: "cloudflare",
    note: "Closed in August. Three features shipped. About 10,000 prompts, read for what people actually wanted.",
  },
  {
    id: "market",
    name: "Market",
    org: "KADO",
    start: "2025-12",
    end: "2026-10",
    live: true,
    roleId: "kado",
    note: "Still open. Founding designer — buyer, seller, and a prototype instead of a deck.",
  },
  {
    id: "access",
    name: "Access",
    org: "UT iSchool",
    start: "2026-02",
    end: "2026-06",
    live: false,
    roleId: "access",
    note: "Ten faculty sites, brought to WCAG 2.1 AA.",
  },
  {
    id: "research",
    name: "Research",
    org: "HRI, UT Austin",
    start: "2025-08",
    end: "2025-12",
    live: false,
    roleId: "hri",
    note: "Interaction design for human–robot studies, and help running them.",
  },
  {
    id: "study",
    name: "Study",
    org: "M.S. UX, UT Austin",
    start: "2025-08",
    end: "2027-05",
    live: true,
    note: "UX track, through May 2027. Human–AI interaction, research, architecture, access.",
  },
];

const RANGE_START = 2025 * 12 + 7;
const RANGE_END = 2027 * 12 + 4;

function monthIndex(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

export function threadBox(start: string, end: string) {
  const span = RANGE_END - RANGE_START;
  const left = ((monthIndex(start) - RANGE_START) / span) * 100;
  const width = ((monthIndex(end) - monthIndex(start)) / span) * 100;
  return { left, width };
}

export const NOW_MARK = ((monthIndex("2026-10") - RANGE_START) / (RANGE_END - RANGE_START)) * 100;

export type Metric = {
  id: string;
  value: number;
  from?: number;
  suffix: string;
  label: string;
  note: string;
  decimals?: number;
};

export const METRICS: Metric[] = [
  {
    id: "sites",
    value: 270,
    suffix: "+",
    label: "Websites / year",
    note: "Synology. Six subsidiaries, a hundred stakeholders, one practice holding the sites together.",
  },
  {
    id: "users",
    value: 2,
    suffix: "M+",
    label: "Daily users",
    note: "Metro Taipei. Research through the interface. The store rating rose 15.8%.",
  },
  {
    id: "visitors",
    value: 73,
    suffix: "×",
    label: "Tutorial visitors",
    note: "The hub, after search, filters, and a clearer map of the content.",
  },
  {
    id: "sat",
    value: 89,
    from: 82,
    suffix: "%",
    label: "Stakeholder satisfaction",
    note: "82 to 89. Clearer reviews, cleaner handoff.",
  },
  {
    id: "features",
    value: 3,
    suffix: "",
    label: "Agent features shipped",
    note: "Enterprise beta, the agent label, the finalizing state. Shipped before August.",
  },
  {
    id: "prompts",
    value: 10,
    suffix: "K",
    label: "Prompts read",
    note: "Read for intent, then checked against a small eval setup.",
  },
];

export type Skill = { id: string; label: string };

export const SKILL_GROUPS: { id: string; label: string; items: Skill[] }[] = [
  {
    id: "ai",
    label: "AI-native",
    items: [
      { id: "hai", label: "Human–AI interaction" },
      { id: "agent", label: "LLM agent experiences" },
      { id: "vibe", label: "Vibe coding" },
    ],
  },
  {
    id: "product",
    label: "Product & UX",
    items: [
      { id: "research", label: "User research" },
      { id: "ia", label: "Information architecture" },
      { id: "proto", label: "Wireframes & prototypes" },
      { id: "systems", label: "Design systems" },
      { id: "a11y", label: "Accessibility, WCAG 2.2 AA" },
      { id: "data", label: "Usability & behavioral data" },
      { id: "craft", label: "Industrial & CMF" },
    ],
  },
];

export const TOOL_LINES = [
  "Figma · Framer · Adobe Creative Suite · SwiftUI",
  "VS Code · GitHub · GitLab · Cloudflare OS",
  "GA4 · Microsoft Clarity · Hotjar · Power BI · JASP",
  "Agile / Scrum · M365 · ClickUp · English & Mandarin",
];

export function orgsForSkill(id: string) {
  const names = ROLES.filter((role) => role.skills.includes(id)).map((role) => role.org);
  return [...new Set(names)];
}

export const EDUCATION = [
  {
    school: "The University of Texas at Austin",
    title: "M.S. Information Studies, UX track",
    when: "Expected May 2027",
    note: "STEM-designated. Human–AI Interaction, Quantitative Research, Information Architecture, Accessibility UX.",
  },
  {
    school: "National Kaohsiung Normal University",
    title: "BFA, Industrial & Product Design",
    when: "Undergraduate",
    note: "The physical-product foundation under the digital work.",
  },
];

export const RECOGNITION = [
  {
    title: "UX Design Lead, Longhorn Developers",
    when: "Aug 2025 — Jan 2026",
    note: "Led UX undergraduates redesigning the UT MarketPlace site and app. Mentored juniors and set up critique.",
  },
  {
    title: "UX Design Awards — Nominated, IDZ Berlin",
    when: "2026",
    note: "Selected among 500+ participants from 46 countries.",
  },
  {
    title: "Taiwan Ministry of Education Scholarship",
    when: "2017 — 2018",
    note: "$50,000 to study product design at College for Creative Studies.",
  },
  {
    title: "Taipei Metro UI/UX Hackathon",
    when: "Top 4 of 200",
    note: "A public-service brief, before the later contract on the transit app.",
  },
];

export const CHAPTERS = [
  { id: "signal", index: "00", label: "Signal" },
  { id: "now", index: "01", label: "Now" },
  { id: "trace", index: "02", label: "Trace" },
  { id: "scale", index: "03", label: "Scale" },
  { id: "method", index: "04", label: "Method" },
  { id: "record", index: "05", label: "Record" },
];
