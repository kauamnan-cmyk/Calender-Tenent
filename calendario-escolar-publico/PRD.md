# PRD — Plataforma de Calendários Escolares

**Versão:** 1.0  
**Status:** Planejamento inicial  
**Plataforma:** Aplicação web responsiva (mobile-first)  
**Público:** Instituições de ensino, administradores, responsáveis, alunos e professores

---

## 1. Visão geral

A aplicação será uma plataforma web para criação, gerenciamento e consulta de calendários escolares.

Cada escola poderá possuir múltiplos calendários, como:

- Educação Infantil / Pré-escola
- Ensino Fundamental
- Ensino Médio
- Calendário Geral da Escola

Os administradores poderão criar tags, definir dias letivos e não letivos, cadastrar eventos, adicionar informações e disponibilizar documentos e imagens.

Os usuários públicos poderão consultar um ou vários calendários simultaneamente, aplicando filtros por calendário, período e categorias.

O sistema deverá permitir a sobreposição de calendários para facilitar a consulta de famílias com alunos em diferentes segmentos escolares.

## 2. Objetivos do produto

- Centralizar os calendários escolares em uma única plataforma.
- Facilitar a identificação de dias letivos, não letivos e eventos.
- Permitir que uma escola gerencie vários calendários.
- Permitir a visualização simultânea de múltiplos calendários.
- Simplificar a consulta de informações, documentos e comunicados.
- Oferecer uma interface intuitiva, principalmente em dispositivos móveis.
- Reduzir o trabalho administrativo com ferramentas de cadastro em lote.

## 3. Perfis de usuários

### Visitante

Acessa a página pública, sem autenticação.

Pode:
- Consultar calendários.
- Selecionar um ou vários calendários.
- Alternar entre visualização anual, mensal e semanal.
- Filtrar eventos por tags.
- Consultar informações detalhadas dos dias.
- Visualizar imagens e baixar documentos.

### Administrador da escola

Acessa uma área restrita mediante login.

Pode:
- Criar e editar calendários.
- Criar e configurar tags master.
- Criar e configurar tags comuns.
- Associar tags a um ou vários calendários.
- Cadastrar eventos e informações.
- Gerenciar anexos.
- Configurar regras de aplicação automática.
- Editar datas individualmente ou em lote.

---

# 4. Gerenciamento de calendários

**RF-01 — Criação de calendários**

O administrador poderá criar quantos calendários forem necessários.

Cada calendário terá:

- Identificador único.
- Nome.
- Descrição opcional.
- Cor de identificação opcional.
- Ano letivo.
- Status ativo/inativo.

Exemplo:

Calendário: Ensino Fundamental  
Ano: 2027

Calendário: Ensino Médio  
Ano: 2027

**RF-02 — Independência dos calendários**

Cada calendário possuirá seus próprios dias, eventos e classificações.

O mesmo dia poderá apresentar conteúdos diferentes em cada calendário.

**RF-03 — Compartilhamento de tags**

Durante a criação ou edição de uma tag, o administrador poderá selecionar a quais calendários ela pertence.

Uma tag poderá ser compartilhada por vários calendários sem precisar ser duplicada.

**RF-04 — Seleção múltipla de calendários**

O visitante poderá selecionar um ou vários calendários para consulta simultânea.

Exemplo:

[x] Fundamental  
[ ] Pré-escola  
[x] Ensino Médio

O calendário exibirá a união das informações dos calendários selecionados.

**RF-05 — Visualização geral**

Disponibilizar a opção "Todos", que ativa todos os calendários disponíveis.

A seleção individual e a seleção geral deverão ser mutuamente consistentes.

---

# 5. Sistema de tags

O sistema terá dois tipos de tags:

1. Tags master.
2. Tags comuns.

## 5.1. Tags master

**RF-06 — Criação de tags master**

As tags master serão responsáveis por definir a classificação principal de um dia e alterar a cor de fundo do respectivo card no calendário.

Exemplos iniciais:

- Dia letivo — verde claro.
- Dia não letivo — vermelho claro.

O administrador poderá criar outras tags master personalizadas.

Cada tag master deverá possuir:

- Nome.
- Cor de fundo.
- Cor de texto ou contraste automático.
- Descrição opcional.
- Calendários associados.
- Dias da semana permitidos.
- Regra de aplicação padrão.

**RF-07 — Configuração dos dias permitidos**

Na criação ou edição da tag master, será possível definir em quais dias da semana ela poderá ser aplicada.

Exemplo:

Tag: Dia letivo

Dias permitidos:
- Segunda-feira
- Terça-feira
- Quarta-feira
- Quinta-feira
- Sexta-feira

Sábado e domingo não permitidos.

A interface deve impedir a aplicação da tag em dias não autorizados, inclusive em operações em lote.

**RF-08 — Aplicação automática**

O administrador poderá definir uma tag master como padrão para determinados dias da semana em cada calendário.

Exemplo:

Calendário: Ensino Fundamental

Tag padrão: Dia letivo

Período: Ano letivo de 2027

Dias: Segunda a sexta-feira.

O sistema deverá aplicar automaticamente a classificação correspondente, respeitando exceções cadastradas e restrições de datas.

**RF-09 — Dias não letivos**

A tag master "Dia não letivo" poderá substituir a classificação de determinados dias.

Exemplo:

Segunda-feira, 15/11

Classificação: Dia não letivo.

Fundo do card: vermelho claro.

Por padrão, sábados e domingos serão considerados dias sem atividade letiva, mas não deverão receber automaticamente o fundo vermelho.

Finais de semana permanecerão com aparência neutra, exceto quando houver uma configuração explícita que permita outra classificação.

**RF-10 — Exclusividade da tag master**

Um mesmo dia poderá possuir apenas uma classificação master por calendário.

Ao trocar sua classificação, a nova tag master substituirá a anterior naquele calendário.

As tags comuns e os eventos não serão removidos.

## 5.2. Tags comuns

**RF-11 — Criação de tags comuns**

As tags comuns serão representadas por pequenos círculos coloridos dentro dos dias do calendário.

Exemplos:

- Reunião.
- Avaliação.
- Evento.
- Formação.
- Matrícula.
- Conselho de classe.
- Comunicado.

Cada tag terá:

- Nome.
- Cor.
- Ícone opcional.
- Descrição.
- Calendários associados.

**RF-12 — Múltiplas tags por dia**

Um dia poderá receber várias tags comuns simultaneamente.

Exemplo:

15 de março

Master: Dia letivo

Tags comuns:
- Reunião.
- Avaliação.

**RF-13 — Compartilhamento entre calendários**

Uma tag comum poderá ser disponibilizada em mais de um calendário.

Exemplo:

Tag: Reunião

Calendários:
- Fundamental.
- Ensino Médio.

A definição da tag será única, mesmo quando compartilhada.

Entretanto, cada calendário poderá possuir eventos diferentes associados à mesma tag.

---

# 6. Sobreposição de calendários

**RF-14 — União das informações**

Quando o usuário selecionar múltiplos calendários, o sistema deverá apresentar as informações combinadas.

Exemplo:

Calendário Fundamental:
- Dia letivo.
- Reunião.

Calendário Ensino Médio:
- Dia letivo.
- Avaliação.

Visualização combinada:
- Fundo verde indicando dia letivo.
- Bolinha azul: Reunião.
- Bolinha amarela: Avaliação.

**RF-15 — Remoção de tags duplicadas**

Quando a mesma tag estiver associada a mais de um calendário selecionado, sua representação visual deverá aparecer apenas uma vez no card do dia.

Exemplo:

Fundamental: Reunião.

Ensino Médio: Reunião.

Resultado:
- Apenas uma bolinha azul de Reunião.

Ao abrir os detalhes do dia, o usuário poderá identificar a quais calendários aquela informação pertence.

Eventos distintos não deverão ser ocultados apenas por utilizarem a mesma tag.

**RF-16 — Conflito entre tags master**

Quando os calendários selecionados possuírem classificações master diferentes para uma mesma data, o sistema deverá preservar as informações de ambos.

Proposta de comportamento:

- Classificações iguais: utilizar o fundo correspondente.
- Classificações diferentes: utilizar um fundo neutro com um indicador visual de múltiplas classificações.
- Nos detalhes, mostrar a classificação individual de cada calendário.

Exemplo:

Fundamental: Dia letivo.

Ensino Médio: Dia não letivo.

Resultado: indicação de classificação divergente.

Essa regra evita transmitir informações incorretas ao visitante.

---

# 7. Visualização pública

**RF-17 — Modos de visualização**

O calendário permitirá visualizar:

- Ano.
- Mês.
- Semana.

A visualização mensal será o padrão no celular.

**RF-18 — Seletor de calendários**

O seletor de calendários deverá ficar permanentemente acessível na tela principal, próximo ao seletor de período.

Utilizar um componente simples de seleção múltipla, com aparência semelhante aos controles "Ano / Mês / Semana".

Exemplo:

[Todos] [Fundamental ✓] [Pré-escola] [Médio ✓]

O usuário poderá selecionar ou desmarcar calendários com um toque.

Em telas pequenas, permitir rolagem horizontal dos filtros.

Não exigir abertura de modal para realizar a seleção principal de calendários.

**RF-19 — Indicadores do dia**

Cada dia poderá apresentar:

- Número da data.
- Fundo colorido conforme tag master.
- Bolinhas coloridas das tags comuns.
- Indicador de anexos.
- Destaque para o dia atual.

**RF-20 — Legendas por calendário**

Cada calendário deverá possuir sua própria legenda, formada pelas tags disponíveis nele.

Ao selecionar vários calendários, mostrar uma legenda consolidada.

Tags compartilhadas deverão aparecer uma única vez.

A legenda deverá apresentar a diferença entre:

- Tags master: cores de fundo.
- Tags comuns: círculos coloridos.

**RF-21 — Filtro por tags**

O usuário poderá selecionar uma ou mais tags na legenda para destacar os dias correspondentes.

Os filtros serão aplicados sobre os calendários atualmente selecionados.

**RF-22 — Busca**

Permitir pesquisar eventos por nome, categoria, data e descrição.

---

# 8. Detalhes do dia

**RF-23 — Consulta detalhada**

Ao clicar em uma data, exibir:

- Data completa.
- Calendários com informações naquele dia.
- Classificação master de cada calendário.
- Tags comuns.
- Eventos.
- Descrições.
- Horários.
- Locais.
- Imagens e documentos.

**RF-24 — Organização por calendário**

Quando houver múltiplos calendários selecionados, o conteúdo deverá identificar claramente a origem de cada informação.

Exemplo:

15 de março

Ensino Fundamental:
- Dia letivo.
- Reunião de pais.

Ensino Médio:
- Dia letivo.
- Avaliação trimestral.

**RF-25 — Eventos compartilhados**

Um evento poderá ser vinculado a um ou vários calendários.

Se um mesmo evento estiver associado a dois calendários selecionados, ele deverá aparecer apenas uma vez, acompanhado da identificação dos calendários correspondentes.

Eventos diferentes com títulos semelhantes deverão continuar aparecendo separadamente.

---

# 9. Eventos e anexos

**RF-26 — Cadastro de eventos**

O administrador poderá criar eventos contendo:

- Título.
- Data.
- Calendários associados.
- Tag comum.
- Descrição detalhada.
- Horário inicial e final.
- Local.
- Observações.
- Visibilidade pública ou privada.

**RF-27 — Anexos**

Permitir associar arquivos aos eventos e diretamente aos dias.

Tipos previstos:

- PDF.
- DOCX.
- XLSX.
- JPG.
- PNG.

**RF-28 — Visualização de arquivos**

A página pública deverá permitir:

- Visualizar imagens.
- Abrir documentos compatíveis.
- Baixar arquivos.
- Consultar nome, formato e tamanho.

**RF-29 — Galeria de imagens**

Permitir múltiplas imagens por evento, com visualização ampliada e download individual.

---

# 10. Administração do calendário

**RF-30 — Editor por dia**

O administrador poderá clicar em uma data para:

- Alterar tag master.
- Adicionar ou remover tags comuns.
- Criar eventos.
- Editar descrições.
- Adicionar anexos.
- Remover informações existentes.

Todas as alterações deverão respeitar o calendário selecionado.

**RF-31 — Edição em lote**

Permitir selecionar vários dias para aplicar ou remover classificações.

**RF-32 — Aplicação por período**

Permitir escolher:

- Calendário(s).
- Tag.
- Data inicial.
- Data final.
- Dias da semana.

Exemplo:

Aplicar "Dia letivo" de segunda a sexta no calendário Fundamental durante determinado período.

**RF-33 — Exceções e substituições**

O administrador poderá substituir a classificação master de dias específicos sem alterar a regra padrão de todo o calendário.

Exemplo:

Segunda a sexta: Dia letivo.

Exceção: 7 de setembro — Dia não letivo.

**RF-34 — Validação de regras**

O sistema deverá validar as restrições de aplicação definidas para cada tag master.

Quando determinada operação não for permitida, mostrar uma mensagem clara explicando o motivo.

---

# 11. Requisitos não funcionais

**RNF-01 — Responsividade:** interface mobile-first, compatível com celular, tablet e desktop.

**RNF-02 — Performance:** a navegação entre calendários, filtros e períodos deve ser rápida e fluida.

**RNF-03 — Acessibilidade:** garantir contraste, áreas de toque adequadas e identificação de categorias que não dependa exclusivamente da cor.

**RNF-04 — Segurança:** a futura implementação do backend deverá controlar autenticação, autorização e acesso a documentos privados.

**RNF-05 — Escalabilidade:** a estrutura deverá permitir múltiplos calendários, anos, tags e eventos.

**RNF-06 — Integridade:** referências entre calendários, eventos e tags deverão utilizar identificadores únicos.

**RNF-07 — Consistência:** alterações administrativas deverão refletir corretamente na visualização pública, respeitando a publicação e a visibilidade dos dados.

---

# 12. Estrutura de dados inicial

Entidades principais:

### School
- id
- name
- logo
- settings

### Calendar
- id
- schoolId
- name
- description
- year
- color
- active

### Tag
- id
- schoolId
- name
- type (master/common)
- color
- description
- icon
- calendarIds

### MasterTagRule
- id
- calendarId
- tagId
- allowedWeekdays
- defaultWeekdays
- startDate
- endDate

### CalendarDay
- id
- calendarId
- date
- masterTagId
- masterOverride
- description

### DayTag
- calendarDayId
- tagId

### Event
- id
- title
- description
- date
- startTime
- endTime
- location
- tagId
- calendarIds
- visibility

### Attachment
- id
- eventId (opcional)
- calendarDayId (opcional)
- name
- type
- size
- url

Observação: as relações entre tags, eventos e calendários deverão ser normalizadas no banco de dados definitivo, utilizando tabelas associativas quando necessário.

---

# 13. Regras de negócio essenciais

**RN-01:** Uma escola poderá possuir múltiplos calendários.

**RN-02:** Uma tag poderá pertencer a vários calendários.

**RN-03:** Cada data poderá possuir apenas uma tag master por calendário.

**RN-04:** Cada data poderá possuir várias tags comuns.

**RN-05:** Tags master alteram o fundo do dia; tags comuns são representadas por pontos coloridos.

**RN-06:** Sábados e domingos serão neutros por padrão, sem aplicação automática da tag master "Dia não letivo".

**RN-07:** Regras de dias permitidos devem ser respeitadas em operações individuais e em lote.

**RN-08:** A seleção de múltiplos calendários apresentará a união de suas informações.

**RN-09:** Tags compartilhadas não serão visualmente duplicadas nos dias ou na legenda consolidada.

**RN-10:** Eventos compartilhados serão deduplicados pelo identificador do evento, não pelo título.

**RN-11:** Divergências entre classificações master de calendários selecionados deverão ser sinalizadas.

**RN-12:** O visitante poderá consultar eventos públicos e baixar anexos públicos sem autenticação.

---

# 14. Escopo do MVP

O MVP deverá contemplar:

1. Visualização pública anual, mensal e semanal.
2. Criação e gerenciamento de múltiplos calendários.
3. Seleção simultânea de calendários.
4. Criação de tags master personalizáveis.
5. Configuração de cores, dias permitidos e aplicação padrão.
6. Criação de tags comuns.
7. Associação de tags a múltiplos calendários.
8. Sobreposição e deduplicação de informações.
9. Legendas dinâmicas e filtros por calendário/tag.
10. Cadastro e edição de eventos.
11. Informações detalhadas dos dias.
12. Upload, visualização e download de anexos.
13. Área administrativa com login.
14. Edição individual e em lote.
15. Aplicação de classificações por período.

### Fora do escopo inicial

- Aplicativo mobile nativo.
- Notificações push.
- Integração com Google Calendar.
- Integração com sistemas acadêmicos.
- Envio de comunicados por WhatsApp ou e-mail.
- Controle de presença.
- Gestão de notas ou matrículas.
- Relatórios analíticos avançados.

---

# 15. Critérios de aceite principais

O MVP estará funcional quando:

- O administrador conseguir criar três calendários independentes.
- Uma tag master puder ser configurada e aplicada automaticamente de segunda a sexta.
- Sábados e domingos permanecerem neutros por padrão.
- Um feriado em dia útil puder substituir a classificação letiva.
- Tags comuns puderem ser compartilhadas por calendários diferentes.
- O visitante conseguir selecionar Fundamental e Ensino Médio simultaneamente.
- Tags compartilhadas aparecerem uma única vez na visualização consolidada.
- Informações de eventos diferentes forem preservadas na sobreposição.
- Conflitos entre classificações master forem apresentados corretamente.
- O visitante conseguir abrir os detalhes de uma data e consultar os eventos de cada calendário.
- Documentos e imagens públicos puderem ser visualizados ou baixados.
- O administrador conseguir editar vários dias em uma única operação.

---

# 16. Resultado esperado

Uma plataforma escolar simples, moderna e responsiva, capaz de organizar diferentes calendários em um único ambiente.

Para a escola, o produto deverá facilitar o cadastro e a manutenção de dias letivos, eventos e comunicados.

Para famílias, professores e alunos, deverá permitir uma consulta rápida e intuitiva, especialmente quando precisarem acompanhar mais de um calendário ao mesmo tempo.

O diferencial central do produto será a combinação de:

**Calendários independentes + sobreposição inteligente + tags master de fundo + tags comuns + documentos e informações detalhadas.**