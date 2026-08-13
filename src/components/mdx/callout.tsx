import type { ReactNode } from "react";
import { currentDictionary } from "./locale";

const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

/** Opt-in structure. Use it where the call deserves its own weight. */
export async function Decision({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return (
    <div className="mt-6 border-l-2 border-accent pl-5">
      <p className={label}>{dict.case.decision}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export async function Tradeoffs({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return (
    <div className="mt-6">
      <p className={label}>{dict.case.tradeoffs}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
