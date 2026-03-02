import Link from 'next/link';
import { getPublishedPosts } from '@/features/blog/actions';
import { formatDate } from '@/lib/utils';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-center text-4xl font-bold">Blog</h1>
          <p className="mb-12 text-center text-muted-foreground">Latest posts and updates</p>

          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post: Awaited<ReturnType<typeof getPublishedPosts>>[number]) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
                    {post.coverImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="mb-2 text-2xl font-bold transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                      <p className="mb-4 text-muted-foreground">
                        {post.excerpt || post.content.slice(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.author.name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
