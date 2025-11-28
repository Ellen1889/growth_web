import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <SearchX className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Prompt Not Found</h2>
      <p className="text-gray-500 mb-6">This prompt does not exist or has been removed.</p>
      <Link
        href="/prompts"
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Prompt Library
      </Link>
    </div>
  );
}
