import { getTools } from '@/lib/notion';
import { ExternalLink } from 'lucide-react';

export const revalidate = 60;

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900">Tools & Stack</h2>
        <p className="text-gray-500">The software powering my growth machine.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 flex-shrink-0">
              <img
                src={tool.iconUrl || 'https://via.placeholder.com/48'}
                alt={tool.name}
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{tool.name}</h3>
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-green-400" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">{tool.category}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  tool.price === 'Paid' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-green-50 text-green-700 border-green-100'
                }`}>
                  {tool.price}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
