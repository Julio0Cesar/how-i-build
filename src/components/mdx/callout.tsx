import type { ReactNode } from "react";
import { currentDictionary } from "./locale";


/** Opt-in structure. Use it where the call deserves its own weight. */
export async function Decision({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return (
    <div className="mt-8 border border-accent bg-accent-soft/40 p-5">
      <p className="stamp text-accent">{dict.case.decision}</p>
      <div className="[&>p:first-child]:mt-3">{children}</div>
    </div>
  );
}

export async function Tradeoffs({ children }: { children?: ReactNode }) {
  const dict = await currentDictionary();
  return (
    <div className="mt-6">
      <p className="stamp text-muted-foreground">{dict.case.tradeoffs}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
