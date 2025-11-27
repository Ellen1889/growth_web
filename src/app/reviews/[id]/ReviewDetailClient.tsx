'use client';

import { Review } from '@/types';

export default function ReviewCoverImage({ review }: { review: Review }) {
  return (
    <img
      src={review.coverImage || 'https://via.placeholder.com/800x400'}
      alt={review.title}
      className="w-full h-full object-cover"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://via.placeholder.com/800x400?text=' + encodeURIComponent(review.title.substring(0, 30));
      }}
    />
  );
}
