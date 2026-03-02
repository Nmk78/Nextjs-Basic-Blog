import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/features/blog/actions';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <article className="container relative z-10 mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {post.coverImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
              <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name || ''}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span>{post.author.name || 'Anonymous'}</span>
              </div>
              <span>•</span>
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
          </header>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
}
