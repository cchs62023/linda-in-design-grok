import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  COLUMNS,
  FIELD_COLS,
  FIELD_ROWS,
  OVERLAYS,
  STORIES,
  dotKind,
  shipCount,
  type DotKind,
} from "@/data/cv";

const SHIPS = shipCount();

type Mode = "all" | "shipped";

type Props = {
  col: number;
  onCol: (col: number) => void;
};

export function SignalField({ col, onCol }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<{ el: HTMLElement; x: number; y: number }[]>([]);
  const ptr = useRef({ x: -9999, y: -9999, inside: false });
  const raf = useRef(0);
  const [mode, setMode] = useState<Mode>("all");
  const [scrubbed, setScrubbed] = useState(false);
  const [hot, setHot] = useState(false);

  const column = COLUMNS[col];
  const story = STORIES[column.story];
  const overlay = column.overlay ? OVERLAYS[column.overlay] : null;

  useEffect(() => {
    const grid = rootRef.current;
    if (!grid) return;

    const measure = () => {
      const box = grid.getBoundingClientRect();
      dotsRef.current = [...grid.querySelectorAll<HTMLElement>("[data-dot]")].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: r.left - box.left + r.width / 2,
          y: r.top - box.top + r.height / 2,
        };
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useLayoutEffect(() => {
    const plus = plusRef.current;
    if (!plus || !ptr.current.inside) return;
    plus.style.left = `${ptr.current.x}px`;
    plus.style.top = `${ptr.current.y}px`;
  });

  function paint() {
    raf.current = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { x, y, inside } = ptr.current;
    for (const dot of dotsRef.current) {
      if (!inside || reduce) {
        dot.el.style.setProperty("--inf", "0");
        continue;
      }
      const dist = Math.hypot(x - dot.x, y - dot.y);
      const inf = Math.max(0, 1 - dist / 132);
      dot.el.style.setProperty("--inf", inf.toFixed(3));
    }
  }

  function queuePaint() {
    if (!raf.current) raf.current = requestAnimationFrame(paint);
  }

  function pointFromEvent(event: PointerEvent<HTMLDivElement>) {
    const grid = rootRef.current;
    if (!grid) return null;
    const box = grid.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - box.left, 0), box.width);
    const y = Math.min(Math.max(event.clientY - box.top, 0), box.height);
    const next = Math.round((x / Math.max(box.width, 1)) * (FIELD_COLS - 1));
    return { x, y, next: Math.max(0, Math.min(FIELD_COLS - 1, next)) };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const point = pointFromEvent(event);
    if (!point) return;
    ptr.current = { x: point.x, y: point.y, inside: true };
    if (plusRef.current) {
      plusRef.current.style.left = `${point.x}px`;
      plusRef.current.style.top = `${point.y}px`;
    }
    if (!scrubbed) setScrubbed(true);
    if (!hot) setHot(true);
    if (point.next !== col) onCol(point.next);
    queuePaint();
  }

  function onPointerLeave() {
    ptr.current.inside = false;
    setHot(false);
    queuePaint();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next = col;
    if (event.key === "ArrowRight") next = Math.min(FIELD_COLS - 1, col + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, col - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = FIELD_COLS - 1;
    else return;
    event.preventDefault();
    if (!scrubbed) setScrubbed(true);
    onCol(next);
  }

  return (
    <div className="signal">
      <div className="signal-kicker">
        <p>Where the signal holds</p>
        <p>Dossier — 00</p>
      </div>

      <div className={mode === "shipped" ? "field is-shipped" : "field"}>
        <div
          ref={rootRef}
          className="field-hit"
          style={{ "--col": String(col) } as CSSProperties}
          role="slider"
          tabIndex={0}
          aria-label="Career signal from 2018 to now"
          aria-valuemin={2018}
          aria-valuemax={2026}
          aria-valuenow={column.label === "NOW" ? 2026 : Number(column.label)}
          aria-valuetext={`${column.label}. ${story.title}. ${story.body}`}
          onKeyDown={onKeyDown}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerMove}
        >
          {Array.from({ length: FIELD_ROWS }, (_, row) =>
            Array.from({ length: FIELD_COLS }, (_, c) => {
              const kind: DotKind = dotKind(c, row);
              return (
                <span key={`${c}-${row}`} className={c === col ? "cell is-col" : "cell"}>
                  <span className="dot" data-dot data-kind={kind} aria-hidden="true" />
                </span>
              );
            }),
          )}
          <div className="scan" aria-hidden="true" />
          <div ref={plusRef} className={hot ? "field-plus is-on" : "field-plus"} aria-hidden="true" />
          <p className={scrubbed ? "hint is-gone" : "hint"} aria-hidden="true">
            Move across the field
          </p>
        </div>
      </div>

      <div className="axis" aria-hidden="true">
        <span>2018</span>
        <span className="axis-line">
          <span className="axis-head" />
        </span>
        <span>Now</span>
      </div>

      <div className="legend">
        <div className="legend-modes" role="group" aria-label="Signal filter">
          <button
            type="button"
            className={mode === "all" ? "legend-btn is-on" : "legend-btn"}
            aria-pressed={mode === "all"}
            onClick={() => setMode("all")}
          >
            <span className="legend-mark is-trace" />
            All
          </button>
          <button
            type="button"
            className={mode === "shipped" ? "legend-btn is-on" : "legend-btn"}
            aria-pressed={mode === "shipped"}
            onClick={() => setMode("shipped")}
          >
            <span className="legend-mark is-ship" />
            Shipped
            <span className="legend-count">{SHIPS}</span>
          </button>
        </div>
        <p className="legend-year">{column.label}</p>
      </div>

      <div className="readout">
        <div key={story.id} className="readout-story">
          <p className="kicker">{story.kicker}</p>
          <p className="readout-title">{story.title}</p>
          <p className="readout-body">{story.body}</p>
        </div>
        <div className={overlay ? "overlay is-open" : "overlay"}>
          <div className="overlay-clip">
            {overlay ? (
              <div key={overlay.title} className="overlay-inner">
                <p className="kicker">{overlay.kicker}</p>
                <p className="overlay-title">{overlay.title}</p>
                <p className="readout-body">{overlay.body}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
