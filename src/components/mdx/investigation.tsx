import type { ReactNode } from "react";
import { currentDictionary } from "./locale";

/**
 * Os três blocos que marcam o processo, não o resultado: o que surpreendeu, o
 * que se achava antes — inclusive errado — e o que se fez para descobrir.
 *
 * Nenhum usa cor de alerta. Uma hipótese errada é parte do texto, não um aviso
 * a esconder, e pintá-la de amarelo diria o contrário.
 */
const frame = "my-8 border-y border-rule py-4";
const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

function Block({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className={frame}>
      <p className={label}>{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export async function Observation({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return <Block title={dict.case.observation}>{children}</Block>;
}

export async function Hypothesis({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return <Block title={dict.case.hypothesis}>{children}</Block>;
}

export async function Experiment({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return <Block title={dict.case.experiment}>{children}</Block>;
}
