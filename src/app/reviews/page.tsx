import { getReviews } from '@/lib/notion';
import ReviewCard from './ReviewCard';

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-gray-900">Content Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
