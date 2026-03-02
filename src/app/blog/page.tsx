import Link from 'next/link';
import { getPublishedPosts } from '@/features/blog/actions';
import { formatDate } from '@/lib/utils';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground">All the latest articles and updates</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-muted-foreground">No posts yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Awaited<ReturnType<typeof getPublishedPosts>>[number]) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mb-4 flex-1 text-sm text-muted-foreground">
                      {post.excerpt || post.content.slice(0, 120)}...
                    </p>
                    <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {post.author.image && (
                          <img
                            src={post.author.image}
                            alt={post.author.name || ''}
                            className="h-6 w-6 rounded-full"
                          />
                        )}
                        <span>{post.author.name || 'Anonymous'}</span>
                      </div>
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
