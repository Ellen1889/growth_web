import { getExperiments } from '@/lib/notion';
import Link from 'next/link';

export const revalidate = 60;

export default async function ExperimentsPage() {
  const experiments = await getExperiments();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-gray-900">Experiments</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map(exp => (
          <Link key={exp.id} href={`/experiments/${exp.id}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{exp.title}</h3>
                </div>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {exp.category}
                  </span>
                </div>

                {exp.resultSummary && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{exp.resultSummary}</p>
                )}

                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <span>{exp.publishedDate ? new Date(exp.publishedDate).toLocaleDateString() : 'No date'}</span>
                <span className="flex items-center gap-1">
                  Priority: {exp.adoptionPriority}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {experiments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No experiments found. Add some experiments in Notion to see them here.</p>
        </div>
      )}
    </div>
  );
}
