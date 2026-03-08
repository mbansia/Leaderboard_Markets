import { GLOSSARY } from '../data/content';

export const explainTerm = (term: string) => GLOSSARY[term] ?? '';
