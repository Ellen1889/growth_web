import { getTerms } from '@/lib/notion';
import KnowledgeClient from './KnowledgeClient';

export const revalidate = 60;

export default async function KnowledgePage() {
  const terms = await getTerms();

  // Get unique categories for filtering
  const categories = ['All', ...new Set(terms.map(t => t.category))];

  return <KnowledgeClient terms={terms} categories={categories} />;
}
