import { getExperiments } from '@/lib/notion';
import ExperimentGenerator from '@/components/ExperimentGenerator';

export const revalidate = 60;

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Running': 'bg-blue-50 text-blue-700 border-blue-100',
    'Success': 'bg-green-50 text-green-700 border-green-100',
    'Failed': 'bg-red-50 text-red-700 border-red-100',
    'Inconclusive': 'bg-gray-50 text-gray-700 border-gray-100'
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colors[status] || colors['Inconclusive']}`}>
      {status}
    </span>
  );
};

export default async function ExperimentsPage() {
  const experiments = await getExperiments();

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-gray-900">Experiment Log</h2>
      <ExperimentGenerator />
      <div className="grid gap-6">
        {experiments.map(exp => (
          <div key={exp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <span className="text-xs text-gray-400 font-mono">{exp.date}</span>
              </div>
              <StatusBadge status={exp.status} />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Problem</span>
                <p className="text-sm text-gray-700 leading-relaxed">{exp.problem}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-2">Hypothesis</span>
                <p className="text-sm text-gray-700 leading-relaxed bg-green-50 p-3 rounded-lg border border-green-100 italic">
                  "{exp.hypothesis}"
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Results</span>
                <p className="text-sm font-medium text-gray-900 mb-1">{exp.metric}</p>
                <p className="text-sm text-gray-600">{exp.resultSummary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
