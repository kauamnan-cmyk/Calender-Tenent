import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSchool, useTagMap } from "@/lib/school-store";
import { longDate } from "@/lib/school-data";

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function SearchBox({ onPick, year }: { onPick: (date: string) => void; year: number }) {
  const [q, setQ] = useState("");
  const { events, days, tags } = useSchool();
  const tagMap = useTagMap();
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (n.length < 2) return [];
    const out: { date: string; title: string; color?: string | undefined; tag?: string | undefined }[] = [];
    for (const e of events) {
      if (e.visibility !== "public") continue;
      const t = tagMap.get(e.tagId);
      if ([e.title, e.description, e.info ?? "", e.location ?? "", t?.name ?? ""].some((s) => norm(s).includes(n)))
        out.push({ date: e.date, title: e.title, color: t?.color, tag: t?.name });
    }
    const tagHit = tags.filter((t) => norm(t.name).includes(n)).map((t) => t.id);
    for (const d of Object.values(days)) {
      if (d.note && norm(d.note).includes(n)) out.push({ date: d.date, title: d.note.slice(0, 60) });
      else if (tagHit.some((t) => t !== "letivo" && d.tagIds.includes(t))) {
        const t = tagMap.get(tagHit.find((x) => d.tagIds.includes(x))!);
        out.push({ date: d.date, title: d.note ?? t?.name ?? "", color: t?.color, tag: t?.name });
      }
    }
    const seen = new Set<string>();
    return out
      .filter((r) => {
        const k = r.date + r.title;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => (a.date.startsWith(String(year)) === b.date.startsWith(String(year)) ? a.date.localeCompare(b.date) : a.date.startsWith(String(year)) ? -1 : 1))
      .slice(0, 30);
  }, [q, events, days, tags, tagMap, year]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar eventos no calendário..." className="h-11 rounded-xl bg-card pl-9 pr-9" aria-label="Buscar eventos" />
      {q && (
        <button type="button" onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Limpar busca">
          <X className="size-4" />
        </button>
      )}
      {q.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-xl border bg-popover p-1 shadow-lift">
          {results.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">Nenhum evento encontrado.</p>}
          {results.map((r) => (
            <button
              key={r.date + r.title}
              type="button"
              onClick={() => {
                onPick(r.date);
                setQ("");
              }}
              className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left hover:bg-muted"
            >
              <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-muted-foreground" style={r.color ? { backgroundColor: r.color } : undefined} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{r.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {longDate(r.date)}
                  {r.tag && ` · ${r.tag}`}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
