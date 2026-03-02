import Link from 'next/link';
import { getUserPosts } from '@/features/blog/actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Plus, FileText, Eye, Edit } from 'lucide-react';

export default async function DashboardBlogPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const posts = await getUserPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/dashboard/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">No posts yet. Create your first post!</p>
            <Button asChild>
              <Link href="/dashboard/blog/new">Create Post</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post: Awaited<ReturnType<typeof getUserPosts>>[number]) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.excerpt || post.content.slice(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                      {post.publishedAt && ` • Published ${formatDate(post.publishedAt)}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {post.published && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/blog/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
