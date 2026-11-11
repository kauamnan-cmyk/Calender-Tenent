import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MONTHS, parseKey, toKey } from "@/lib/school-data";
import { useSchool } from "@/lib/school-store";
import { MonthView, WeekView, YearView, type CalendarCtx } from "./CalendarViews";
import { DayDetail } from "./DayDetail";
import { ActiveFilters, LegendFilters, emptyFilters, filterActive, makeMatcher, type FilterState } from "./Filters";
import { SearchBox } from "./SearchBox";

type Mode = "year" | "month" | "week";

export function PublicCalendar() {
  const { settings, dayTags } = useSchool();
  const [mode, setMode] = useState<Mode>("month");
  const [anchor, setAnchor] = useState(() => toKey(new Date()));
  const [selected, setSelected] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1280) setMode("month");
  }, []);

  const a = parseKey(anchor);
  const year = a.getFullYear();
  const month = a.getMonth();

  const ctx: CalendarCtx = useMemo(
    () => ({ isMatch: makeMatcher(filters, (d) => dayTags(d)), filterActive: filterActive(filters), onSelect: setSelected, selected }),
    [filters, dayTags, selected],
  );

  const shift = (dir: number) => {
    const d = parseKey(anchor);
    if (mode === "year") d.setFullYear(d.getFullYear() + dir, 0, 1);
    if (mode === "month") d.setMonth(d.getMonth() + dir, 1);
    if (mode === "week") d.setDate(d.getDate() + 7 * dir);
    setAnchor(toKey(d));
  };

  const weekStart = new Date(year, month, a.getDate() - a.getDay());
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);
  const label =
    mode === "year"
      ? String(year)
      : mode === "month"
        ? `${MONTHS[month]} ${year}`
        : `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]!.slice(0, 3).toLowerCase()} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]!.slice(0, 3).toLowerCase()}`;

  const goTo = (date: string) => {
    setAnchor(date);
    if (mode === "year") setMode("month");
    setSelected(date);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
            {settings.logoUrl ? <img src={settings.logoUrl} alt="" className="size-full object-cover" /> : <GraduationCap className="size-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-muted-foreground">{settings.schoolName}</p>
            <h1 className="truncate text-base font-extrabold tracking-tight sm:text-lg">Calendário Escolar — {year}</h1>
          </div>

        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-3 py-4 sm:px-4 lg:grid-cols-[1fr_300px] lg:py-6">
        <div className="min-w-0 space-y-3">
          <SearchBox onPick={goTo} year={year} />
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v as Mode)} className="rounded-xl border bg-card p-1">
              {(["year", "month", "week"] as Mode[]).map((m) => (
                <ToggleGroupItem key={m} value={m} className="h-8 rounded-lg px-3 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  {m === "year" ? "Ano" : m === "month" ? "Mês" : "Semana"}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button variant="outline" size="sm" className="h-10 rounded-xl" onClick={() => setAnchor(toKey(new Date()))}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" className="h-10 rounded-xl lg:hidden" onClick={() => setSheet(true)}>
              <SlidersHorizontal /> Filtros
              {filterActive(filters) && <span className="size-2 rounded-full bg-primary" />}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-card px-2 py-1.5 shadow-soft">
            <Button variant="ghost" size="icon" onClick={() => shift(-1)} aria-label="Anterior">
              <ChevronLeft />
            </Button>
            <h2 className="text-base font-bold capitalize">{label}</h2>
            <Button variant="ghost" size="icon" onClick={() => shift(1)} aria-label="Próximo">
              <ChevronRight />
            </Button>
          </div>

          <ActiveFilters value={filters} onChange={setFilters} />

          <section className={mode === "month" ? "rounded-2xl border bg-card p-2 shadow-soft sm:p-3" : ""}>
            {mode === "month" && <MonthView year={year} month={month} ctx={ctx} />}
            {mode === "year" && (
              <YearView
                year={year}
                ctx={ctx}
                onOpenMonth={(m) => {
                  setAnchor(toKey(new Date(year, m, 1)));
                  setMode("month");
                }}
              />
            )}
            {mode === "week" && <WeekView anchor={anchor} ctx={ctx} />}
          </section>

          <p className="px-1 text-xs text-muted-foreground">{settings.info}</p>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border bg-card p-4 shadow-soft">
            <LegendFilters value={filters} onChange={setFilters} />
          </div>
        </aside>
      </main>

      <Drawer open={sheet} onOpenChange={setSheet}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Filtros</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">
            <LegendFilters value={filters} onChange={setFilters} />
          </div>
          <div className="flex gap-2 border-t p-4">
            <Button variant="outline" className="flex-1" onClick={() => setFilters(emptyFilters)}>
              Limpar filtros
            </Button>
            <Button className="flex-1" onClick={() => setSheet(false)}>
              Ver calendário
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <DayDetail date={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
