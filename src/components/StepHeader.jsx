import config from "../config";

const STEPS = [
  { n: 1, label: "Build Your Card" },
  { n: 2, label: "Complete Your Card" },
  { n: 3, label: "Buddy Match" },
];

export default function StepHeader({ current }) {
  return (
    <header className="w-full border-b border-line bg-white/80 backdrop-blur px-4 sm:px-6 lg:px-16 py-3 sm:py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-7 w-7 rounded-sm bg-coral shrink-0" aria-hidden="true" />
        <span className="font-display font-bold text-ink text-sm tracking-tight truncate max-w-[110px] sm:max-w-none">
          {config.WORKSHOP_NAME}
        </span>
      </div>

      <ol className="flex items-center gap-2 sm:gap-3 lg:gap-6 shrink-0">
        {STEPS.map((s) => {
          const state = s.n === current ? "active" : s.n < current ? "done" : "upcoming";
          return (
            <li key={s.n} className="flex items-center gap-2">
              <span
                className={[
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors",
                  state === "active" && "bg-ink text-white border-ink",
                  state === "done" && "bg-success/20 text-success border-success/40",
                  state === "upcoming" && "bg-transparent text-ink-soft border-line",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {state === "done" ? "✓" : s.n}
              </span>
              <span className={`hidden md:inline text-sm ${state === "active" ? "text-ink font-semibold" : "text-ink-soft"}`}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
