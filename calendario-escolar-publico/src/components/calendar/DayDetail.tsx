import { useState } from "react";
import { CalendarX2, Clock, Download, Eye, FileSpreadsheet, FileText, FileImage, File, ChevronLeft, ChevronRight, MapPin, X, Info, Lock } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSchool, useTagMap } from "@/lib/school-store";
import { formatSize, longDate, type FileAtt, type ImageAtt, type SchoolEvent } from "@/lib/school-data";

export function TagPill({ tagId }: { tagId: string }) {
  const t = useTagMap().get(tagId);
  if (!t) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium">
      <span className="size-2 rounded-full" style={{ backgroundColor: t.color }} />
      {t.name}
    </span>
  );
}

function fileIcon(ext: string) {
  if (["XLSX", "XLS", "CSV"].includes(ext)) return FileSpreadsheet;
  if (["JPG", "JPEG", "PNG", "WEBP"].includes(ext)) return FileImage;
  if (["PDF", "DOCX", "DOC", "TXT"].includes(ext)) return FileText;
  return File;
}

function download(name: string, url?: string) {
  if (url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  } else toast.success(`Download simulado: ${name}`);
}

export function FileList({ files }: { files: FileAtt[] }) {
  if (!files.length) return null;
  return (
    <ul className="space-y-2">
      {files.map((f) => {
        const Icon = fileIcon(f.ext);
        return (
          <li key={f.id} className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{f.name}</p>
              <p className="text-xs text-muted-foreground">
                {f.ext} · {formatSize(f.size)}
              </p>
            </div>
            {f.ext === "PDF" && (
              <Button size="icon" variant="ghost" aria-label="Visualizar" onClick={() => (f.url ? window.open(f.url) : toast.info(`Pré-visualização simulada de ${f.name}`))}>
                <Eye className="size-4" />
              </Button>
            )}
            <Button size="icon" variant="ghost" aria-label="Baixar" onClick={() => download(f.name, f.url)}>
              <Download className="size-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export function Gallery({ images }: { images: ImageAtt[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  if (!images.length) return null;
  const cur = idx !== null ? images[idx] : null;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((im, i) => (
          <button key={im.id} type="button" onClick={() => setIdx(i)} className="aspect-square overflow-hidden rounded-lg border">
            <img src={im.url} alt={im.name} loading="lazy" className="size-full object-cover transition-transform hover:scale-105" />
          </button>
        ))}
      </div>
      <Dialog open={idx !== null} onOpenChange={(o) => !o && setIdx(null)}>
        <DialogContent className="max-w-3xl gap-3 p-3 [&>button]:hidden">
          <DialogTitle className="sr-only">{cur?.name}</DialogTitle>
          {cur && (
            <>
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <img src={cur.url} alt={cur.name} className="max-h-[70vh] w-full object-contain" />
                {images.length > 1 && (
                  <>
                    <Button size="icon" variant="secondary" className="absolute left-2 top-1/2 -translate-y-1/2" aria-label="Anterior" onClick={() => setIdx((idx! - 1 + images.length) % images.length)}>
                      <ChevronLeft />
                    </Button>
                    <Button size="icon" variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2" aria-label="Próxima" onClick={() => setIdx((idx! + 1) % images.length)}>
                      <ChevronRight />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="flex-1 truncate text-sm font-medium">
                  {cur.name} <span className="text-muted-foreground">· {idx! + 1}/{images.length}</span>
                </p>
                <Button size="sm" variant="outline" onClick={() => download(cur.name, cur.url)}>
                  <Download /> Baixar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIdx(null)}>
                  <X /> Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EventCard({ e }: { e: SchoolEvent }) {
  const tag = useTagMap().get(e.tagId);
  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-soft">
      <div className="h-1" style={{ backgroundColor: tag?.color }} />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug">{e.title}</h3>
          {e.visibility === "private" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Lock className="size-3" /> Interno
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <TagPill tagId={e.tagId} />
          {e.start && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {e.start.replace(":", "h")}
              {e.end && ` às ${e.end.replace(":", "h")}`}
            </span>
          )}
          {e.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {e.location}
            </span>
          )}
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed">{e.description}</p>
        {e.info && (
          <p className="flex gap-2 rounded-lg bg-primary-soft p-2.5 text-sm text-accent-foreground">
            <Info className="mt-0.5 size-4 shrink-0" /> {e.info}
          </p>
        )}
        <Gallery images={e.images} />
        {e.files.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documentos disponíveis</p>
            <FileList files={e.files} />
          </div>
        )}
      </div>
    </article>
  );
}

function DayBody({ date, includePrivate }: { date: string; includePrivate?: boolean | undefined }) {
  const { dayEvents, dayTags, days, tags } = useSchool();
  const evs = dayEvents(date, includePrivate);
  const tagIds = dayTags(date, includePrivate);
  const info = days[date];
  const tagMap = new Map(tags.map((t) => [t.id, t]));
  const empty = !evs.length && !info?.note && !info?.files.length && !info?.images.length;
  return (
    <div className="space-y-5">
      {tagIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagIds.map((t) => (
            <TagPill key={t} tagId={t} />
          ))}
        </div>
      )}
      {(info?.note || info?.files.length || info?.images.length) && (
        <section className="space-y-3 rounded-xl border bg-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Informações gerais</h3>
          {info?.note && <p className="text-sm leading-relaxed">{info.note}</p>}
          <Gallery images={info?.images ?? []} />
          <FileList files={info?.files ?? []} />
        </section>
      )}
      {evs.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Eventos do dia</h3>
          {evs.map((e) => (
            <EventCard key={e.id} e={e} />
          ))}
        </section>
      )}
      {empty && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
          <CalendarX2 className="size-8 text-muted-foreground" />
          <p className="font-semibold">Nenhum evento nesta data</p>
          <p className="text-sm text-muted-foreground">
            {tagIds.length ? tagIds.map((t) => tagMap.get(t)?.description).join(" ") : "Não há informações cadastradas para este dia."}
          </p>
        </div>
      )}
    </div>
  );
}

export function DayDetail({ date, onClose, includePrivate }: { date: string | null; onClose: () => void; includePrivate?: boolean }) {
  const mobile = useIsMobile();
  const { dayEvents } = useSchool();
  const n = date ? dayEvents(date, includePrivate).length : 0;
  const sub = n === 0 ? "Nenhum evento cadastrado" : n === 1 ? "1 evento cadastrado" : `${n} eventos cadastrados`;
  if (mobile)
    return (
      <Drawer open={!!date} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{date && longDate(date)}</DrawerTitle>
            <DrawerDescription>{sub}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">{date && <DayBody date={date} includePrivate={includePrivate} />}</div>
        </DrawerContent>
      </Drawer>
    );
  return (
    <Sheet open={!!date} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-background sm:max-w-lg">
        <SheetHeader className="mb-5 px-0">
          <SheetTitle className="text-xl">{date && longDate(date)}</SheetTitle>
          <SheetDescription>{sub}</SheetDescription>
        </SheetHeader>
        {date && <DayBody date={date} includePrivate={includePrivate} />}
      </SheetContent>
    </Sheet>
  );
}
