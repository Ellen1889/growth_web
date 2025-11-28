import { getPromptById, getPageBlocks } from '@/lib/notion';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  // Fetch all content blocks from the Notion page
  const blocks = await getPageBlocks(id);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Link
        href="/prompts"
        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Prompt Library
      </Link>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-white p-8 border-b border-gray-100">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-100 inline-block mb-4">
            {prompt.category}
          </span>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{prompt.title}</h1>
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {prompt.tags.map((tag, i) => (
                <span key={i} className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-8 md:p-12">
          {/* Render all Notion page content blocks */}
          {blocks.length > 0 ? (
            <NotionBlockRenderer blocks={blocks} />
          ) : (
            <p className="text-gray-500 italic">No content available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
