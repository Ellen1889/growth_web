'use client';

import Link from 'next/link';
import { PlayCircle, Mic, Book, Library, ArrowUpRight } from 'lucide-react';
import { Review, ContentType } from '@/types';

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex text-yellow-400 text-sm">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "fill-current" : "text-gray-200"}>★</span>
    ))}
  </div>
);

const ContentIcon = ({ type }: { type: ContentType }) => {
  switch (type) {
    case ContentType.VIDEO: return <PlayCircle className="w-4 h-4" />;
    case ContentType.PODCAST: return <Mic className="w-4 h-4" />;
    case ContentType.BOOK: return <Book className="w-4 h-4" />;
    default: return <Library className="w-4 h-4" />;
  }
};

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md hover:border-green-200 transition-all group"
    >
      <div className="h-48 overflow-hidden rounded-t-xl relative">
        <img
          src={review.coverImage || 'https://via.placeholder.com/300'}
          alt={review.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(review.title.substring(0, 20));
          }}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
          <ContentIcon type={review.type} />
          {review.type}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <ArrowUpRight className="text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all drop-shadow-md" size={32} />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-green-700 transition-colors mb-1">{review.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">by {review.contributor}</p>
          <RatingStars rating={review.rating} />
        </div>
        {review.datePublished && (
          <p className="text-xs text-gray-400 mb-4">{new Date(review.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        )}
        {review.takeaways && (
          <div className="flex-1">
            <p className="text-sm text-gray-600 line-clamp-3">{review.takeaways}</p>
          </div>
        )}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {review.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
