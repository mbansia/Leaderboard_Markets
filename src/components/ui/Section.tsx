import type { PropsWithChildren } from 'react';

export function Section({ id, title, kicker, children }: PropsWithChildren<{ id?: string; title: string; kicker?: string }>) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-14">
      {kicker && <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">{kicker}</p>}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
