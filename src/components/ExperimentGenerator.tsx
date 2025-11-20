'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { generateHypothesis } from '@/services/geminiService';

const ExperimentGenerator: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ hypothesis: string; metric: string } | null>(null);

  const handleGenerate = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateHypothesis(problem);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="font-display font-bold text-indigo-900">AI Hypothesis Generator</h3>
      </div>
      <p className="text-sm text-indigo-700 mb-4">
        Stuck on how to test a problem? Describe the issue, and I'll generate a structured hypothesis for you.
      </p>
      
      <div className="flex gap-3 flex-col sm:flex-row">
        <input 
          type="text" 
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g., Users are dropping off at the shipping address step."
          className="flex-1 border border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !problem}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-white p-5 rounded-lg border border-indigo-100 shadow-sm animate-fade-in">
          <div className="mb-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Suggested Hypothesis</span>
            <p className="text-gray-800 font-medium mt-1">{result.hypothesis}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Primary Metric</span>
            <p className="text-gray-800 font-mono text-sm mt-1 bg-gray-100 inline-block px-2 py-1 rounded">
              {result.metric}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentGenerator;
