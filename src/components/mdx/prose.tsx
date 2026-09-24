import type { ReactNode } from "react";

/**
 * Elementos de markdown na tipografia do site.
 *
 * O texto vive em 68 caracteres, que é a medida de leitura. Bloco técnico —
 * código, tabela — respira até 84: é ele que precisa caber sem quebrar quando o
 * assunto é um encadeamento de comandos.
 */
const read = "max-w-[68ch]";
const wide = "max-w-[84ch]";
export const prose = {
  h2: ({ children, ...props }: { children?: ReactNode; id?: string }) => (
    <h2
      {...props}
      className="mt-14 scroll-mt-24 border-t border-rule pt-10 font-serif text-xl tracking-tight first:mt-0 first:border-t-0 first:pt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children?: ReactNode; id?: string }) => (
    <h3 {...props} className="mt-8 scroll-mt-24 font-serif text-lg tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className={`mt-5 ${read} leading-relaxed`}>{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className={`mt-5 ${read} list-disc space-y-2 pl-5 leading-relaxed`}>
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className={`mt-5 ${read} list-decimal space-y-2 pl-5 leading-relaxed`}>
      {children}
    </ol>
  ),
  /**
   * Um bloco cercado chega como `code` dentro de `pre` e traz uma classe
   * `language-*`. Estilizá-lo como código embutido empilharia um segundo fundo
   * e um segundo recuo dentro do bloco, então o caso cercado renderiza nu e
   * deixa o `pre` acima ser dono da moldura.
   */
  code: ({ children, className }: { children?: ReactNode; className?: string }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-muted px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className={`mt-6 ${wide} overflow-x-auto border border-rule bg-muted p-4 font-mono text-sm leading-relaxed`}>
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className={`mt-6 ${read} border-l-2 border-accent pl-5 font-serif text-lg leading-relaxed`}>
      {children}
    </blockquote>
  ),
  hr: () => <hr className={`mt-10 ${wide} border-t border-rule`} />,
  table: ({ children }: { children?: ReactNode }) => (
    /* O wrapper rola no celular; a tabela sozinha empurraria a página inteira. */
    <div className={`mt-6 ${wide} overflow-x-auto`}>
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-rule px-3 py-2 text-left font-mono text-xs font-normal uppercase tracking-widest text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-rule px-3 py-2 align-top leading-relaxed">{children}</td>
  ),
};
