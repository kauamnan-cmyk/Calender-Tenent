import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTHS, WEEKDAYS_SHORT, key, toKey, parseKey } from "@/lib/school-data";
import { useSchool, useTagMap } from "@/lib/school-store";

export type CalendarCtx = {
  includePrivate?: boolean;
  isMatch: (date: string) => boolean;
  filterActive: boolean;
  onSelect: (date: string) => void;
  selected?: string | null;
  /** optional admin overlay: dates highlighted as selected in multi-select */
  marked?: Set<string>;
};

export function TagDots({ tagIds, max = 3, size = "md" }: { tagIds: string[]; max?: number; size?: "sm" | "md" }) {
  const map = useTagMap();
  const shown = tagIds.slice(0, max);
  const extra = tagIds.length - shown.length;
  return (
    <span className="flex items-center gap-[3px]">
      {shown.map((id) => (
        <span
          key={id}
          title={map.get(id)?.name}
          className={cn("rounded-full", size === "sm" ? "size-1.5" : "size-2")}
          style={{ backgroundColor: map.get(id)?.color }}
        />
      ))}
      {extra > 0 && <span className="text-[10px] font-semibold leading-none text-muted-foreground">+{extra}</span>}
    </span>
  );
}

function useDayState(date: string, ctx: CalendarCtx) {
  const { dayTags, dayEvents, days } = useSchool();
  const tags = dayTags(date, ctx.includePrivate);
  const evs = dayEvents(date, ctx.includePrivate);
  const hasFiles = evs.some((e) => e.files.length || e.images.length) || !!days[date]?.files.length || !!days[date]?.images.length;
  const today = toKey(new Date()) === date;
  const match = ctx.isMatch(date);
  const dim = ctx.filterActive && !match;
  const hl = ctx.filterActive && match;
  const wd = parseKey(date).getDay();
  const weekend = wd === 0 || wd === 6;
  const holiday = tags.includes("feriado");
  return { tags, evs, hasFiles, today, dim, hl, weekend, holiday };
}

export function DayCell({ date, ctx, outside }: { date: string; ctx: CalendarCtx; outside?: boolean }) {
  const s = useDayState(date, ctx);
  const d = parseKey(date).getDate();
  const sel = ctx.selected === date || ctx.marked?.has(date);
  return (
    <button
      type="button"
      onClick={() => ctx.onSelect(date)}
      aria-label={`Dia ${d}${s.evs.length ? `, ${s.evs.length} eventos` : ""}`}
      className={cn(
        "group relative flex aspect-square min-h-11 flex-col items-center justify-between rounded-lg border p-1 text-left transition-all sm:aspect-auto sm:h-24 sm:items-start sm:p-2",
        "border-transparent bg-card hover:border-primary/40 hover:shadow-soft",
        s.weekend && "bg-weekend",
        outside && "opacity-35",
        s.dim && "opacity-30 saturate-50",
        s.hl && "border-primary/50 bg-primary-soft shadow-soft",
        sel && "ring-2 ring-primary",
      )}
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-sm font-semibold",
          s.holiday && "text-destructive",
          s.weekend && !s.holiday && "text-muted-foreground",
          s.today && "bg-primary text-primary-foreground",
        )}
      >
        {d}
      </span>
      <span className="flex w-full items-center justify-center gap-1 sm:justify-between">
        <TagDots tagIds={s.tags} max={3} />
        {s.hasFiles && <Paperclip className="hidden size-3 text-muted-foreground sm:block" aria-label="Contém anexos" />}
      </span>
      {s.evs.length > 1 && (
        <span className="absolute right-1 top-1 hidden rounded-full bg-secondary px-1.5 text-[10px] font-semibold text-secondary-foreground sm:block">
          {s.evs.length}
        </span>
      )}
    </button>
  );
}

export function monthMatrix(y: number, m: number) {
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - first.getDay());
  const count = Math.ceil((first.getDay() + new Date(y, m + 1, 0).getDate()) / 7);
  const weeks: { date: string; outside: boolean }[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < count; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      row.push({ date: toKey(cur), outside: cur.getMonth() !== m });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export function WeekHeader({ compact }: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-7 gap-1 pb-1">
      {WEEKDAYS_SHORT.map((w) => (
        <div key={w} className={cn("text-center font-semibold uppercase tracking-wide text-muted-foreground", compact ? "text-[9px]" : "text-[11px]")}>
          {compact ? w[0] : w}
        </div>
      ))}
    </div>
  );
}

export function MonthView({ year, month, ctx }: { year: number; month: number; ctx: CalendarCtx }) {
  const weeks = monthMatrix(year, month);
  return (
    <div>
      <WeekHeader />
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((c) => (
          <DayCell key={c.date} date={c.date} outside={c.outside} ctx={ctx} />
        ))}
      </div>
    </div>
  );
}

function MiniDay({ date, ctx }: { date: string; ctx: CalendarCtx }) {
  const s = useDayState(date, ctx);
  const d = parseKey(date).getDate();
  return (
    <button
      type="button"
      onClick={() => ctx.onSelect(date)}
      className={cn(
        "flex h-9 flex-col items-center justify-center gap-0.5 rounded-md text-xs transition-colors hover:bg-accent",
        s.weekend && "text-muted-foreground",
        s.holiday && "text-destructive",
        s.dim && "opacity-25",
        s.hl && "bg-primary-soft font-bold",
        s.today && "bg-primary text-primary-foreground hover:bg-primary",
      )}
    >
      <span className="leading-none">{d}</span>
      <TagDots tagIds={s.tags} max={3} size="sm" />
    </button>
  );
}

export function YearView({ year, ctx, onOpenMonth }: { year: number; ctx: CalendarCtx; onOpenMonth: (m: number) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {MONTHS.map((name, m) => (
        <div key={name} className="rounded-xl border bg-card p-3 shadow-soft">
          <button type="button" onClick={() => onOpenMonth(m)} className="mb-2 text-sm font-bold hover:text-primary">
            {name}
          </button>
          <WeekHeader compact />
          <div className="grid grid-cols-7 gap-0.5">
            {monthMatrix(year, m)
              .flat()
              .map((c) => (c.outside ? <span key={c.date} /> : <MiniDay key={c.date} date={c.date} ctx={ctx} />))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function WeekView({ anchor, ctx }: { anchor: string; ctx: CalendarCtx }) {
  const a = parseKey(anchor);
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate() - a.getDay());
  const tagMap = useTagMap();
  const { dayEvents, dayTags } = useSchool();
  const dates = Array.from({ length: 7 }, (_, i) => toKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)));
  return (
    <div className="grid gap-2 md:grid-cols-7">
      {dates.map((date) => {
        const d = parseKey(date);
        const evs = dayEvents(date, ctx.includePrivate);
        const tags = dayTags(date, ctx.includePrivate);
        const today = toKey(new Date()) === date;
        const dim = ctx.filterActive && !ctx.isMatch(date);
        return (
          <button
            key={date}
            type="button"
            onClick={() => ctx.onSelect(date)}
            className={cn(
              "flex min-h-20 gap-3 rounded-xl border bg-card p-3 text-left shadow-soft transition-all hover:border-primary/40 md:min-h-64 md:flex-col",
              (d.getDay() === 0 || d.getDay() === 6) && "bg-weekend",
              dim && "opacity-30",
              ctx.filterActive && !dim && "border-primary/50 bg-primary-soft",
              ctx.selected === date && "ring-2 ring-primary",
            )}
          >
            <div className="flex w-12 shrink-0 flex-col items-center md:w-auto md:flex-row md:gap-2">
              <span className="text-[11px] font-semibold uppercase text-muted-foreground">{WEEKDAYS_SHORT[d.getDay()]}</span>
              <span className={cn("flex size-9 items-center justify-center rounded-full text-lg font-bold", today && "bg-primary text-primary-foreground")}>
                {d.getDate()}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <TagDots tagIds={tags} max={6} />
              {evs.map((e) => (
                <div key={e.id} className="truncate rounded-md border-l-[3px] bg-muted px-2 py-1 text-xs font-medium" style={{ borderLeftColor: tagMap.get(e.tagId)?.color }}>
                  {e.start && <span className="mr-1 text-muted-foreground">{e.start}</span>}
                  {e.title}
                </div>
              ))}
              {!evs.length && tags.length > 0 && <span className="text-xs text-muted-foreground">{tags.map((t) => tagMap.get(t)?.name).join(" · ")}</span>}
              {!evs.length && !tags.length && <span className="text-xs text-muted-foreground">Sem registros</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { key };
