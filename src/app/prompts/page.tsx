import { getPrompts } from '@/lib/notion';
import PromptsClient from './PromptsClient';

export const revalidate = 60;

export default async function PromptsPage() {
  const prompts = await getPrompts();

  // Get unique categories for filtering
  const categories = ['All', ...new Set(prompts.map(p => p.category))];

  return <PromptsClient prompts={prompts} categories={categories} />;
}
