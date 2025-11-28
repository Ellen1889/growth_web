'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Tag } from 'lucide-react';
import { Prompt } from '@/types';

interface PromptsClientProps {
  prompts: Prompt[];
  categories: string[];
}

export default function PromptsClient({ prompts, categories }: PromptsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPrompts = selectedCategory === 'All'
    ? prompts
    : prompts.filter(prompt => prompt.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Prompt Library</h2>
        <p className="text-gray-500">Curated prompts for various use cases.</p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map(prompt => (
          <Link
            key={prompt.id}
            href={`/prompts/${prompt.id}`}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <span className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1 block">
                  {prompt.category}
                </span>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-green-700 transition-colors">
                  {prompt.title}
                </h3>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-green-500 flex-shrink-0" />
            </div>
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {prompt.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{prompt.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No prompts found for this category.
        </div>
      )}
    </div>
  );
}
