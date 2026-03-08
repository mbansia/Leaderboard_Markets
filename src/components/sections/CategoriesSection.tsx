import { CATEGORIES } from '../../data/categories';
import { Section } from '../ui/Section';

export function CategoriesSection() {
  return (
    <Section id="categories" title="Category expansion and recurring demand" kicker="Why this can be a real business">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((c) => (
          <article key={c.name} className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li><strong>Ranked object:</strong> {c.ranked}</li>
              <li><strong>Obsessive behavior:</strong> {c.obsession}</li>
              <li><strong>Oracle metric:</strong> {c.oracle}</li>
              <li><strong>Sync cadence:</strong> {c.cadence}</li>
              <li><strong>Trader behavior:</strong> {c.trader}</li>
              <li><strong>Community behavior:</strong> {c.fan}</li>
              <li><strong>Why fit:</strong> {c.fit}</li>
              <li><strong>Recurring demand thesis:</strong> {c.demand}</li>
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
