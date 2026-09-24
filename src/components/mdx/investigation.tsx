import type { ReactNode } from "react";
import { currentDictionary } from "./locale";

/**
 * The three blocks that mark the process rather than the result: what
 * surprised you, what you believed before — including when it was wrong — and
 * what you did to find out.
 *
 * None of them uses an alert colour. A wrong hypothesis belongs in the text,
 * not in a warning to be hidden away, and painting it amber would say the
 * opposite.
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
