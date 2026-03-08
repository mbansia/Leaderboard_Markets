import { explainTerm } from '../../lib/glossary';

export function GlossaryTerm({ term }: { term: string }) {
  return <abbr title={explainTerm(term)} className="cursor-help border-b border-dotted border-slate-400 no-underline">{term}</abbr>;
}
