import { list, paragraph, plain, type Project } from "./types";

/**
 * Sample content. It exists for two reasons: a template whose `projects` array
 * is empty neither builds nor demonstrates anything, and the pages built in #11
 * and #12 need something to render before real content exists.
 *
 * Two entries rather than one — ordering, a private card and the stub state
 * cannot be seen with a single project.
 */

const ledger: Project = {
  slug: "ledger",
  status: "prod",
  visibility: "public",
  stack: ["TypeScript", "SQLite", "Bun"],
  repoUrl: "https://github.com/your-username/ledger",
  locales: {
    en: {
      name: "Ledger",
      summary:
        "A command-line expense tracker that keeps its data in a single file you can read.",
      role: "Sole author",
      period: "2026",
      updated: {
        problem: "2026-06-14",
        decisions: "2026-07-02",
        challenges: "2026-07-02",
        outcome: "2026-07-19",
        references: "2026-07-19",
      },
      problem: [
        paragraph(
          plain(
            "Every expense tracker I tried owned my data. Exports were lossy, the schema was undocumented, and moving between tools meant retyping months of history.",
          ),
        ),
        paragraph([
          { text: "The constraint was narrow: the file the tool writes has to be " },
          { text: "readable without the tool", code: true },
          { text: ". Everything else followed from that." },
        ]),
      ],
      decisions: [
        {
          title: "One SQLite file, no server",
          updatedAt: "2026-06-21",
          context: [
            paragraph(
              plain(
                "The first version wrote JSON, which stayed readable but made every query a full scan and every write a rewrite of the whole file.",
              ),
            ),
          ],
          decision: [
            paragraph([
              { text: "A single " },
              { text: "ledger.db", code: true },
              {
                text: " file, queried in process. It is still one file to back up or copy, and any SQLite client can open it.",
              },
            ]),
          ],
          tradeoffs: [
            plain("A binary file cannot be diffed in a pull request."),
            plain("Concurrent writes from two shells are rejected rather than merged."),
            [
              { text: "Recovering from corruption needs " },
              { text: "sqlite3", code: true },
              { text: ", not a text editor." },
            ],
          ],
        },
        {
          title: "Import is a first-class command, not a script",
          updatedAt: "2026-07-02",
          context: [
            paragraph(
              plain(
                "Bank exports differ in column order, date format and decimal separator. Handling that in a one-off script meant rewriting it every quarter.",
              ),
            ),
          ],
          decision: [
            paragraph([
              { text: "Import takes a mapping file, so a new bank is a config change rather than code. The mapping lives next to the data, and " },
              { text: "ledger import --dry-run", code: true },
              { text: " prints what would change before anything is written." },
            ]),
          ],
          tradeoffs: [
            plain("A mapping file is one more thing to write before the first import."),
            plain("Formats that need real parsing logic still fall back to a script."),
          ],
        },
      ],
      challenges: [
        {
          title: "Dates that are not dates",
          updatedAt: "2026-07-02",
          body: [
            paragraph(
              plain(
                "Two banks emitted the same ambiguous format with opposite meanings, and neither declared which. The importer now refuses ambiguous columns instead of guessing, and asks once per mapping.",
              ),
            ),
          ],
        },
      ],
      outcome: [
        paragraph(
          plain(
            "Three years of history in a file that opens anywhere, and an import path that survives a bank changing its export format.",
          ),
        ),
        list([
          plain("Queries answer in milliseconds on a decade of entries."),
          plain("Backups are a file copy."),
          [
            { text: "The " },
            { text: "--dry-run", code: true },
            { text: " flag has caught every bad mapping so far." },
          ],
        ]),
      ],
      references: [
        {
          label: "SQLite as an application file format",
          url: "https://www.sqlite.org/appfileformat.html",
        },
      ],
    },
    pt: {
      name: "Ledger",
      summary:
        "Um controle de gastos em linha de comando que guarda os dados num arquivo único e legível.",
      role: "Autor único",
      period: "2026",
      updated: {
        problem: "2026-06-14",
        decisions: "2026-07-02",
        challenges: "2026-07-02",
        outcome: "2026-07-19",
        references: "2026-07-19",
      },
      problem: [
        paragraph(
          plain(
            "Todo controle de gastos que testei era dono dos meus dados. A exportação perdia informação, o schema não era documentado, e trocar de ferramenta significava redigitar meses de histórico.",
          ),
        ),
        paragraph([
          { text: "A restrição era estreita: o arquivo que a ferramenta escreve precisa ser " },
          { text: "legível sem a ferramenta", code: true },
          { text: ". Todo o resto decorreu disso." },
        ]),
      ],
      decisions: [
        {
          title: "Um arquivo SQLite, sem servidor",
          updatedAt: "2026-06-21",
          context: [
            paragraph(
              plain(
                "A primeira versão escrevia JSON, que continuava legível mas fazia de cada consulta uma varredura completa e de cada escrita uma reescrita do arquivo inteiro.",
              ),
            ),
          ],
          decision: [
            paragraph([
              { text: "Um único arquivo " },
              { text: "ledger.db", code: true },
              {
                text: ", consultado no próprio processo. Continua sendo um arquivo só para copiar ou fazer backup, e qualquer cliente SQLite abre.",
              },
            ]),
          ],
          tradeoffs: [
            plain("Arquivo binário não dá para revisar num diff de pull request."),
            plain("Escritas simultâneas de dois terminais são recusadas em vez de mescladas."),
            [
              { text: "Recuperar de uma corrupção exige " },
              { text: "sqlite3", code: true },
              { text: ", não um editor de texto." },
            ],
          ],
        },
        {
          title: "Importação é comando de primeira classe, não script",
          updatedAt: "2026-07-02",
          context: [
            paragraph(
              plain(
                "Exportações de banco divergem na ordem das colunas, no formato de data e no separador decimal. Resolver isso num script avulso significava reescrevê-lo a cada trimestre.",
              ),
            ),
          ],
          decision: [
            paragraph([
              { text: "A importação recebe um arquivo de mapeamento, então um banco novo é mudança de configuração e não de código. O mapeamento fica junto dos dados, e " },
              { text: "ledger import --dry-run", code: true },
              { text: " imprime o que mudaria antes de escrever qualquer coisa." },
            ]),
          ],
          tradeoffs: [
            plain("O mapeamento é mais uma coisa a escrever antes da primeira importação."),
            plain("Formatos que exigem parsing de verdade continuam caindo num script."),
          ],
        },
      ],
      challenges: [
        {
          title: "Datas que não são datas",
          updatedAt: "2026-07-02",
          body: [
            paragraph(
              plain(
                "Dois bancos emitiam o mesmo formato ambíguo com significados opostos, e nenhum declarava qual. O importador agora recusa colunas ambíguas em vez de adivinhar, e pergunta uma vez por mapeamento.",
              ),
            ),
          ],
        },
      ],
      outcome: [
        paragraph(
          plain(
            "Três anos de histórico num arquivo que abre em qualquer lugar, e um caminho de importação que sobrevive a um banco mudando o formato de exportação.",
          ),
        ),
        list([
          plain("Consultas respondem em milissegundos sobre uma década de lançamentos."),
          plain("Backup é cópia de arquivo."),
          [
            { text: "A flag " },
            { text: "--dry-run", code: true },
            { text: " pegou todo mapeamento errado até agora." },
          ],
        ]),
      ],
      references: [
        {
          label: "SQLite como formato de arquivo de aplicação",
          url: "https://www.sqlite.org/appfileformat.html",
        },
      ],
    },
  },
};

/** Stub: listed, with no write-up behind it. Private, so no repository link. */
const atlas: Project = {
  slug: "atlas",
  status: "in-dev",
  visibility: "private",
  stack: ["Rust", "PostgreSQL"],
  stub: true,
  locales: {
    en: {
      name: "Atlas",
      summary: "Route planning for field teams. Write-up pending.",
      role: "Sole author",
      period: "2026",
      updated: {},
      problem: [],
      decisions: [],
      challenges: [],
      outcome: [],
    },
    pt: {
      name: "Atlas",
      summary: "Planejamento de rotas para equipes de campo. Registro pendente.",
      role: "Autor único",
      period: "2026",
      updated: {},
      problem: [],
      decisions: [],
      challenges: [],
      outcome: [],
    },
  },
};

export const projects: Project[] = [ledger, atlas];
