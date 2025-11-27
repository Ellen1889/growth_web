import { getTermById, getPageBlocks } from '@/lib/notion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const term = await getTermById(id);

  if (!term) {
    notFound();
  }

  // Fetch all content blocks from the Notion page
  const blocks = await getPageBlocks(id);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Link
        href="/knowledge"
        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Knowledge Base
      </Link>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-white p-8 border-b border-gray-100">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full border border-green-100 inline-block mb-4">
            {term.category}
          </span>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{term.term}</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light">{term.definition}</p>
        </div>
        <div className="p-8 md:p-12">
          {/* Render all Notion page content */}
          {blocks.length > 0 ? (
            <NotionBlockRenderer blocks={blocks} />
          ) : (
            <p className="text-gray-500 italic">No additional content available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
