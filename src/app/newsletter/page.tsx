import { getSubstackPosts } from '@/lib/substack';

export const revalidate = 3600; // Revalidate every hour

export default async function NewsletterPage() {
  const posts = await getSubstackPosts();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">My Newsletter</h2>
      {posts.map(post => (
        <article key={post.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          {post.imageUrl && (
            <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-50">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500 mb-3">
              {post.categories.map((cat, idx) => (
                <span key={idx} className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">{cat}</span>
              ))}
              {post.categories.length > 0 && <span>•</span>}
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>
            {post.url && (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 font-medium text-sm hover:underline inline-flex items-center gap-1"
              >
                Read Full Article →
              </a>
            )}
          </div>
        </article>
      ))}
      {posts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No newsletter posts found.
        </div>
      )}
    </div>
  );
}
