import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/lib/school-data";
import { useSchool } from "@/lib/school-store";

export type FilterState = { tags: string[]; month: number | null; from: string; to: string };
export const emptyFilters: FilterState = { tags: [], month: null, from: "", to: "" };

export function filterActive(f: FilterState) {
  return f.tags.length > 0 || f.month !== null || !!f.from || !!f.to;
}

export function makeMatcher(f: FilterState, dayTags: (d: string) => string[]) {
  return (date: string) => {
    if (f.month !== null && Number(date.slice(5, 7)) - 1 !== f.month) return false;
    if (f.from && date < f.from) return false;
    if (f.to && date > f.to) return false;
    if (f.tags.length) {
      const t = dayTags(date);
      return f.tags.some((x) => t.includes(x));
    }
    return true;
  };
}

export function LegendFilters({ value, onChange, advanced = true }: { value: FilterState; onChange: (f: FilterState) => void; advanced?: boolean }) {
  const { tags } = useSchool();
  const toggle = (id: string) => onChange({ ...value, tags: value.tags.includes(id) ? value.tags.filter((t) => t !== id) : [...value.tags, id] });
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Legenda e filtros</h3>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onChange({ ...value, tags: tags.map((t) => t.id) })}>
              Selecionar todas
            </Button>
          </div>
        </div>
        {tags.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tag criada.</p>}
        <ul className="grid gap-1">
          {tags.map((t) => {
            const on = value.tags.includes(t.id);
            return (
              <li key={t.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(t.id)}
                  className={cn(
                    "flex min-h-10 w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    on ? "border-primary/40 bg-primary-soft font-semibold" : "border-transparent hover:bg-muted",
                  )}
                >
                  <span className="size-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="flex-1">{t.name}</span>
                  {on && <Check className="size-4 text-primary" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {advanced && (
        <div className="space-y-3 border-t pt-4">
          <div className="space-y-1.5">
            <Label>Filtrar por mês</Label>
            <Select value={value.month === null ? "all" : String(value.month)} onValueChange={(v) => onChange({ ...value, month: v === "all" ? null : Number(v) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os meses</SelectItem>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="from">De</Label>
              <Input id="from" type="date" value={value.from} onChange={(e) => onChange({ ...value, from: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">Até</Label>
              <Input id="to" type="date" value={value.to} onChange={(e) => onChange({ ...value, to: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ActiveFilters({ value, onChange }: { value: FilterState; onChange: (f: FilterState) => void }) {
  const { tags } = useSchool();
  if (!filterActive(value)) return null;
  const chips: { label: string; clear: () => void; color?: string | undefined }[] = [
    ...value.tags.map((id) => {
      const t = tags.find((x) => x.id === id);
      return { label: t?.name ?? id, color: t?.color, clear: () => onChange({ ...value, tags: value.tags.filter((x) => x !== id) }) };
    }),
    ...(value.month !== null ? [{ label: MONTHS[value.month], clear: () => onChange({ ...value, month: null }) }] : []),
    ...(value.from || value.to ? [{ label: `${value.from || "…"} → ${value.to || "…"}`, clear: () => onChange({ ...value, from: "", to: "" }) }] : []),
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">Filtros ativos:</span>
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={c.clear} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted">
          {c.color && <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />}
          {c.label}
          <X className="size-3" />
        </button>
      ))}
      <Button size="sm" variant="link" className="h-7 px-1 text-xs" onClick={() => onChange({ tags: [], month: null, from: "", to: "" })}>
        Limpar filtros
      </Button>
    </div>
  );
}
