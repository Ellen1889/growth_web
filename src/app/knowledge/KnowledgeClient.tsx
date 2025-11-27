'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Term } from '@/types';

interface KnowledgeClientProps {
  terms: Term[];
  categories: string[];
}

export default function KnowledgeClient({ terms, categories }: KnowledgeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTerms = selectedCategory === 'All'
    ? terms
    : terms.filter(term => term.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Knowledge Base</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.map(term => (
          <Link
            key={term.id}
            href={`/knowledge/${term.id}`}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1 block">
                  {term.category}
                </span>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">
                  {term.term}
                </h3>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-green-500" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{term.definition}</p>
          </Link>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No knowledge entries found for this category.
        </div>
      )}
    </div>
  );
}
