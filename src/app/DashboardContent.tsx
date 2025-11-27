'use client';

import Link from 'next/link';
import { FlaskConical, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';
import { Experiment, Review, Reflection } from '@/types';

export default function DashboardContent({
  runningExperiments,
  reviews,
  newsletter
}: {
  runningExperiments: Experiment[];
  reviews: Review[];
  newsletter: Reflection[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="font-display text-3xl font-bold mb-2">Hello, I'm Ellen.</h1>
              <p className="text-green-100 text-lg max-w-lg mb-6">
                Growth Marketing Manager. This is my digital garden where I cultivate experiments, reviews, and marketing knowledge.
              </p>
              <div className="flex gap-3">
                <a href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FlaskConical size={200} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Current Experiment</h3>
          {runningExperiments.length > 0 ? (
            runningExperiments.slice(0, 1).map(e => (
              <div key={e.id}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800 line-clamp-1">{e.title}</span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-100">
                    {e.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{e.hypothesis}</p>
                <Link href="/experiments" className="text-sm text-green-600 font-medium hover:text-green-700 flex items-center gap-1">
                  View Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No active experiments running.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Latest Newsletter</h3>
          <div className="space-y-4">
            {newsletter.slice(0, 2).map(post => (
              <div key={post.id} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex gap-1 flex-wrap">
                    {post.categories.map((cat, idx) => (
                      <span key={idx} className="text-xs font-bold text-green-600 uppercase tracking-wide bg-green-50 px-1.5 py-0.5 rounded">{cat}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition">{post.title}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
            ))}
          </div>
          <Link href="/newsletter" className="mt-4 w-full py-2 text-sm text-gray-500 hover:bg-gray-50 rounded border border-dashed border-gray-300 block text-center">
            Read all posts
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <img
                    src={review.coverImage || 'https://via.placeholder.com/40'}
                    className="w-10 h-10 rounded object-cover bg-gray-100"
                    alt=""
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{review.title}</p>
                    <p className="text-xs text-gray-500">{review.contributor}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "fill-current" : "text-gray-200"}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link href="/reviews" className="mt-4 w-full py-2 text-sm text-gray-500 hover:bg-gray-50 rounded border border-dashed border-gray-300 block text-center">
            Browse Library
          </Link>
        </div>
      </div>
    </div>
  );
}
