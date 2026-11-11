import posterFeira from "@/assets/poster-feira.jpg";
const reuniaoPais = posterFeira;
const festaJunina = posterFeira;

export type Tag = {
  id: string;
  name: string;
  color: string; // hex — tag colors are user data
  icon?: string;
  description: string;
  info?: string;
};

export type ImageAtt = { id: string; name: string; url: string; size: number };
export type FileAtt = { id: string; name: string; ext: string; size: number; url?: string };

export type SchoolEvent = {
  id: string;
  title: string;
  tagId: string;
  date: string; // YYYY-MM-DD
  start?: string;
  end?: string;
  location?: string;
  description: string;
  info?: string;
  visibility: "public" | "private";
  images: ImageAtt[];
  files: FileAtt[];
};

export type DayInfo = {
  date: string;
  note?: string;
  tagIds: string[];
  images: ImageAtt[];
  files: FileAtt[];
};

export type Settings = {
  schoolName: string;
  logoUrl?: string;
  defaultYear: number;
  primary: string;
  info: string;
};

export const PRIMARY_OPTIONS = [
  { label: "Azul institucional", value: "oklch(0.52 0.19 258)" },
  { label: "Azul petróleo", value: "oklch(0.5 0.1 220)" },
  { label: "Verde escola", value: "oklch(0.52 0.13 160)" },
  { label: "Grafite", value: "oklch(0.35 0.03 260)" },
];

export const TAG_ICONS = ["BookOpen", "Flag", "Users", "PenLine", "PartyPopper", "GraduationCap", "Coffee", "ClipboardList", "Star", "Bell"];

export const initialTags: Tag[] = [
  { id: "letivo", name: "Dia letivo", color: "#22a06b", icon: "BookOpen", description: "Dias com atividades escolares regulares." },
  { id: "feriado", name: "Feriado", color: "#e5484d", icon: "Flag", description: "Feriados nacionais, estaduais e municipais. Não há aula." },
  { id: "reuniao", name: "Reunião", color: "#2f6fec", icon: "Users", description: "Reuniões com pais, responsáveis e conselhos de classe." },
  { id: "avaliacao", name: "Avaliação", color: "#e8b400", icon: "PenLine", description: "Datas destinadas às atividades avaliativas, provas e recuperações escolares." },
  { id: "evento", name: "Evento escolar", color: "#8e4ec6", icon: "PartyPopper", description: "Festas, feiras, apresentações e passeios." },
  { id: "formacao", name: "Formação de professores", color: "#f76b15", icon: "GraduationCap", description: "Planejamento e formação continuada. Não há aula para os alunos." },
  { id: "recesso", name: "Recesso", color: "#8b8d98", icon: "Coffee", description: "Períodos de recesso escolar." },
  { id: "matricula", name: "Matrículas e rematrículas", color: "#12a594", icon: "ClipboardList", description: "Períodos de matrícula e rematrícula." },
];

export const pad = (n: number) => String(n).padStart(2, "0");
export const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

const pdf = (name: string, size: number): FileAtt => ({ id: crypto.randomUUID?.() ?? name, name, ext: name.split(".").pop()!.toUpperCase(), size });
const img = (name: string, url: string, size: number): ImageAtt => ({ id: name + url, name, url, size });

function holidays(y: number): [string, string][] {
  const carnaval: [string, string] = y === 2027 ? ["02-08", "02-09"] : ["02-16", "02-17"];
  const corpus = y === 2027 ? "05-27" : "06-04";
  const sexta = y === 2027 ? "03-26" : "04-03";
  return [
    ["01-01", "Confraternização Universal"],
    [carnaval[0], "Carnaval"],
    [carnaval[1], "Carnaval"],
    [sexta, "Sexta-feira Santa"],
    ["04-21", "Tiradentes"],
    ["05-01", "Dia do Trabalho"],
    [corpus, "Corpus Christi"],
    ["09-07", "Independência do Brasil"],
    ["10-12", "Nossa Senhora Aparecida"],
    ["11-02", "Finados"],
    ["11-15", "Proclamação da República"],
    ["11-20", "Dia da Consciência Negra"],
    ["12-25", "Natal"],
  ];
}

function buildYear(y: number) {
  const days: Record<string, DayInfo> = {};
  const events: SchoolEvent[] = [];
  const hol = new Map(holidays(y).map(([md, n]) => [`${y}-${md}`, n]));
  const add = (k: string, tag: string, note?: string) => {
    const d = (days[k] ??= { date: k, tagIds: [], images: [], files: [] });
    if (!d.tagIds.includes(tag)) d.tagIds.push(tag);
    if (note) d.note = d.note ? `${d.note} ${note}` : note;
  };
  for (let m = 0; m < 12; m++) {
    const n = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= n; d++) {
      const k = key(y, m, d);
      const wd = new Date(y, m, d).getDay();
      if (hol.has(k)) { add(k, "feriado", `Feriado: ${hol.get(k)}. Não haverá aula.`); continue; }
      if (wd === 0 || wd === 6) continue;
      const md = m * 100 + d;
      const recesso = md < 102 || (md >= 613 && md <= 624) || md >= 1121;
      if (recesso) add(k, "recesso");
      else add(k, "letivo");
    }
  }
  const ev = (md: string, tagId: string, title: string, description: string, extra: Partial<SchoolEvent> = {}) => {
    const date = `${y}-${md}`;
    events.push({ id: `${y}-${md}-${title}`, title, tagId, date, description, visibility: "public", images: [], files: [], ...extra });
  };
  ["01-25", "01-26", "01-27"].forEach((md) => ev(md, "formacao", "Semana pedagógica", "Planejamento anual e formação continuada da equipe docente.", { start: "08:00", end: "17:00", location: "Sala dos professores" }));
  ev("02-02", "evento", "Início do ano letivo", "Acolhida dos alunos e apresentação das turmas.", { start: "07:30", location: "Pátio central" });
  ev("03-15", "reuniao", "Reunião de Pais e Responsáveis", "Encontro destinado à apresentação dos resultados acadêmicos e ao planejamento das próximas atividades escolares.", {
    start: "14:00", end: "16:00", location: "Auditório da escola", info: "Traga a agenda do aluno.",
    images: [img("Auditório.jpg", reuniaoPais, 245_000)],
    files: [pdf("Comunicado aos pais.pdf", 182_000), pdf("Pauta da reunião.pdf", 96_000)],
  });
  ev("03-15", "avaliacao", "Simulado de Matemática", "Simulado diagnóstico para turmas do Ensino Fundamental II.", { start: "08:00", end: "10:00", location: "Salas de aula" });
  ["04-06", "04-07", "04-08", "04-09"].forEach((md) => ev(md, "avaliacao", "Provas do 1º bimestre", "Avaliações bimestrais conforme cronograma de cada turma.", { files: [pdf("Cronograma de provas.pdf", 120_000), pdf("Conteúdos por disciplina.docx", 54_000)] }));
  ev("05-22", "evento", "Feira de Ciências", "Exposição de projetos científicos desenvolvidos pelos alunos ao longo do semestre. Aberta à comunidade.", {
    start: "09:00", end: "15:00", location: "Ginásio poliesportivo",
    images: [img("Cartaz Feira de Ciências.jpg", posterFeira, 310_000)],
    files: [pdf("Regulamento da feira.pdf", 210_000)],
  });
  ["06-01", "06-02", "06-03"].forEach((md) => ev(md, "avaliacao", "Provas do 2º bimestre", "Avaliações bimestrais.", {}));
  ev("06-12", "evento", "Festa Junina", "Quadrilhas, comidas típicas e brincadeiras para toda a família.", {
    start: "15:00", end: "21:00", location: "Pátio central",
    images: [img("Festa Junina.jpg", festaJunina, 280_000), img("Convite.jpg", posterFeira, 150_000)],
    files: [pdf("Convite Festa Junina.pdf", 330_000), { ...pdf("Escala de barracas.xlsx", 41_000) }],
  });
  ev("06-12", "reuniao", "Conselho de classe", "Reunião interna da equipe pedagógica.", { visibility: "private", start: "08:00", location: "Sala de reuniões" });
  ev("08-14", "reuniao", "Reunião de Pais — 2º semestre", "Apresentação do planejamento do segundo semestre.", { start: "19:00", end: "20:30", location: "Auditório da escola" });
  ["09-21", "09-22", "09-23"].forEach((md) => ev(md, "avaliacao", "Provas do 3º bimestre", "Avaliações bimestrais.", {}));
  ["10-05", "10-06", "10-07", "10-08", "10-09"].forEach((md) => ev(md, "matricula", "Rematrícula", "Período de rematrícula para alunos veteranos. Atendimento na secretaria.", { start: "08:00", end: "18:00", location: "Secretaria", files: [pdf("Ficha de rematrícula.pdf", 88_000)] }));
  ev("10-10", "evento", "Dia das Crianças", "Gincanas e atividades recreativas.", { location: "Quadra" });
  ["11-03", "11-04", "11-05", "11-06"].forEach((md) => ev(md, "avaliacao", "Provas do 4º bimestre", "Avaliações finais.", { files: [pdf("Cronograma de provas finais.pdf", 132_000)] }));
  ev("11-04", "reuniao", "Plantão pedagógico", "Atendimento individual a responsáveis.", { start: "13:30", end: "17:30", location: "Coordenação" });
  ["11-16", "11-17", "11-18", "11-19"].forEach((md) => ev(md, "matricula", "Matrículas — novos alunos", "Período de matrícula para novos alunos.", { location: "Secretaria" }));
  ev("12-12", "evento", "Formatura", "Cerimônia de formatura das turmas concluintes.", { start: "19:00", location: "Auditório da escola" });
  return { days, events };
}

export function buildMock() {
  const a = buildYear(2026);
  const b = buildYear(2027);
  return { days: { ...a.days, ...b.days }, events: [...a.events, ...b.events] };
}

export const initialSettings: Settings = {
  schoolName: "Escola Exemplo",
  defaultYear: 2026,
  primary: "oklch(0.52 0.19 258)",
  info: "Calendario demonstrativo com dados ficticios.",
};

export function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function parseKey(k: string) {
  const [y = 0, m = 1, d = 1] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export const toKey = (d: Date) => key(d.getFullYear(), d.getMonth(), d.getDate());
export function longDate(k: string) {
  const d = parseKey(k);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]!.toLowerCase()} de ${d.getFullYear()}`;
}
