import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getExperimentById, getPageBlocks } from '@/lib/notion';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';

export const dynamic = 'force-dynamic';

interface ExperimentDetailPageProps {
  params: Promise<{ id: string }>;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    'Running': 'bg-blue-100 text-blue-800 border-blue-200',
    'Success': 'bg-green-100 text-green-800 border-green-200',
    'Failed': 'bg-red-100 text-red-800 border-red-200',
    'Inconclusive': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const colorClass = statusColors[status] || statusColors['Inconclusive'];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
      {status}
    </span>
  );
};

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
            <StatusBadge status={experiment.status} />
          </div>
          {experiment.date && (
            <p className="text-sm text-gray-500">
              {new Date(experiment.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Problem</h2>
              <p className="text-gray-700 leading-relaxed">{experiment.problem}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Hypothesis</h2>
              <p className="text-gray-700 leading-relaxed">{experiment.hypothesis}</p>
            </div>
          </div>

          {experiment.metric && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Metric</h2>
              <p className="text-gray-700 leading-relaxed">{experiment.metric}</p>
            </div>
          )}

          {experiment.resultSummary && (
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Result Summary</h2>
              <p className="text-gray-700 leading-relaxed">{experiment.resultSummary}</p>
            </div>
          )}

          {blocks && blocks.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h2>
              <NotionBlockRenderer blocks={blocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
