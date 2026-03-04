import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPublishedPosts } from '@/features/blog/actions';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      {post.coverImage && (
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="mx-auto mt-10 max-w-3xl">
          <header className="mb-12 rounded-xl border bg-card p-6 shadow-sm md:p-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-3">
                {post.author?.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name || ''}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-foreground">{post.author?.name || 'Anonymous'}</p>
                  <p className="text-sm">{formatDate(post.publishedAt || post.createdAt)}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          <footer className="mt-16 border-t py-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              ← Back to Blog
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
}
