import { createFileRoute } from "@tanstack/react-router";
import { PublicCalendar } from "@/components/calendar/PublicCalendar";
import { SchoolProvider } from "@/lib/school-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calendário Escolar — Escola Exemplo" },
      { name: "description", content: "Consulte feriados, reuniões, avaliações e eventos do ano letivo." },
      { property: "og:title", content: "Calendário Escolar — Escola Exemplo" },
      { property: "og:description", content: "Consulte feriados, reuniões, avaliações e eventos do ano letivo." },
    ],
  }),
  component: () => (
    <SchoolProvider>
      <PublicCalendar />
    </SchoolProvider>
  ),
});
