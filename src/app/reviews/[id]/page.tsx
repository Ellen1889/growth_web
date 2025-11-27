import { getReviewById, getPageBlocks } from '@/lib/notion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, PlayCircle, Mic, Book, Library } from 'lucide-react';
import { ContentType } from '@/types';
import { notFound } from 'next/navigation';
import ReviewCoverImage from './ReviewDetailClient';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex text-yellow-400 text-lg">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "fill-current" : "text-gray-200"}>★</span>
    ))}
  </div>
);

const ContentIcon = ({ type }: { type: ContentType }) => {
  switch (type) {
    case ContentType.VIDEO: return <PlayCircle className="w-5 h-5" />;
    case ContentType.PODCAST: return <Mic className="w-5 h-5" />;
    case ContentType.BOOK: return <Book className="w-5 h-5" />;
    default: return <Library className="w-5 h-5" />;
  }
};

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  // Fetch all content blocks from the Notion page
  const blocks = await getPageBlocks(id);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Link
        href="/reviews"
        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Reviews
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="h-64 md:h-96 overflow-hidden relative">
          <ReviewCoverImage review={review} />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
            <ContentIcon type={review.type} />
            {review.type}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{review.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-sm">by</span>
              <span className="font-medium text-gray-900">{review.contributor}</span>
            </div>
            <span className="text-gray-300">•</span>
            <RatingStars rating={review.rating} />
            {review.datePublished && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm">
                  {new Date(review.datePublished).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </>
            )}
          </div>

          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {review.tags.map((tag, i) => (
                <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Show takeaways from properties if available */}
          {review.takeaways && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-8 whitespace-pre-line">{review.takeaways}</p>
              </div>
            </div>
          )}

          {/* Render all Notion page content blocks */}
          {blocks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Full Review</h2>
              <NotionBlockRenderer blocks={blocks} />
            </div>
          )}

          {!review.takeaways && blocks.length === 0 && (
            <p className="text-gray-500 italic">No additional content available.</p>
          )}

          {review.url && (
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              View Original Content
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
