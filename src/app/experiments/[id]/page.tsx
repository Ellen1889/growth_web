import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getExperimentById, getPageBlocks } from '@/lib/notion';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';

export const dynamic = 'force-dynamic';

interface ExperimentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExperimentDetailPage({ params }: ExperimentDetailPageProps) {
  const { id } = await params;
  const experiment = await getExperimentById(id);

  if (!experiment) {
    notFound();
  }

  const blocks = await getPageBlocks(id);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/experiments"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Experiments
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{experiment.title}</h1>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {experiment.category}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {experiment.publishedDate && (
              <span>
                {new Date(experiment.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            <span className="flex items-center gap-1">
              Priority: {experiment.adoptionPriority}
            </span>
          </div>

          {experiment.tags && experiment.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {experiment.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 space-y-6">
          {experiment.resultSummary && (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Result Summary</h2>
              <p className="text-gray-700 leading-relaxed">{experiment.resultSummary}</p>
            </div>
          )}

          {blocks && blocks.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Details</h2>
              <NotionBlockRenderer blocks={blocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
