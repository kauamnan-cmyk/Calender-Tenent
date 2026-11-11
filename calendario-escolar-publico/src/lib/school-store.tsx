import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildMock, initialSettings, initialTags, type DayInfo, type SchoolEvent, type Settings, type Tag } from "./school-data";

type Store = {
  tags: Tag[];
  events: SchoolEvent[];
  days: Record<string, DayInfo>;
  settings: Settings;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  saveTag: (t: Tag) => void;
  deleteTag: (id: string) => void;
  saveEvent: (e: SchoolEvent) => void;
  deleteEvent: (id: string) => void;
  saveDay: (d: DayInfo) => void;
  toggleDayTag: (date: string, tagId: string, force?: boolean) => void;
  setSettings: (s: Settings) => void;
  /** tag ids shown on a day (day tags + tags of public events unless includePrivate) */
  dayTags: (date: string, includePrivate?: boolean) => string[];
  dayEvents: (date: string, includePrivate?: boolean) => SchoolEvent[];
};

const Ctx = createContext<Store | null>(null);
const mock = buildMock();

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState(initialTags);
  const [events, setEvents] = useState(mock.events);
  const [days, setDays] = useState(mock.days);
  const [settings, setSettings] = useState(initialSettings);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", settings.primary);
    document.documentElement.style.setProperty("--ring", settings.primary);
  }, [settings.primary]);

  const value = useMemo<Store>(() => {
    const byDate = new Map<string, SchoolEvent[]>();
    for (const e of events) {
      const l = byDate.get(e.date) ?? [];
      l.push(e);
      byDate.set(e.date, l);
    }
    const dayEvents = (date: string, includePrivate = false) =>
      (byDate.get(date) ?? []).filter((e) => includePrivate || e.visibility === "public").sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));
    const tagIds = new Set(tags.map((t) => t.id));
    return {
      tags, events, days, settings, isAdmin, setAdmin, setSettings,
      saveTag: (t) => setTags((l) => (l.some((x) => x.id === t.id) ? l.map((x) => (x.id === t.id ? t : x)) : [...l, t])),
      deleteTag: (id) => {
        setTags((l) => l.filter((t) => t.id !== id));
        setEvents((l) => l.filter((e) => e.tagId !== id));
        setDays((d) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, { ...v, tagIds: v.tagIds.filter((x) => x !== id) }])));
      },
      saveEvent: (e) => setEvents((l) => (l.some((x) => x.id === e.id) ? l.map((x) => (x.id === e.id ? e : x)) : [...l, e])),
      deleteEvent: (id) => setEvents((l) => l.filter((e) => e.id !== id)),
      saveDay: (d) => setDays((all) => ({ ...all, [d.date]: d })),
      toggleDayTag: (date, tagId, force) =>
        setDays((all) => {
          const d = all[date] ?? { date, tagIds: [], images: [], files: [] };
          const has = d.tagIds.includes(tagId);
          const want = force ?? !has;
          if (want === has) return all;
          return { ...all, [date]: { ...d, tagIds: want ? [...d.tagIds, tagId] : d.tagIds.filter((t) => t !== tagId) } };
        }),
      dayEvents,
      dayTags: (date, includePrivate) => {
        const s = new Set(days[date]?.tagIds ?? []);
        dayEvents(date, includePrivate).forEach((e) => s.add(e.tagId));
        return tags.filter((t) => s.has(t.id) && tagIds.has(t.id)).map((t) => t.id);
      },
    };
  }, [tags, events, days, settings, isAdmin]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSchool() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSchool outside provider");
  return c;
}

export function useTagMap() {
  const { tags } = useSchool();
  return useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
}
