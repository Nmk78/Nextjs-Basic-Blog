import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserPosts, getPublishedPosts } from '@/features/blog/actions';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Eye, Edit, Globe } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const userPosts = await getUserPosts();
  const publishedPosts = await getPublishedPosts();
  const publishedCount = userPosts.filter((p) => p.published).length;
  const draftCount = userPosts.filter((p) => !p.published).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                {userPosts.length === 0 ? 'No posts yet' : `${userPosts.length} posts created`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCount}</div>
              <p className="text-xs text-muted-foreground">
                {publishedCount === 0 ? 'No posts published' : `${publishedCount} live posts`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground">
                {draftCount === 0 ? 'All posts published' : `${draftCount} drafts`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Posts</CardTitle>
                <Button asChild size="sm">
                  <Link href="/dashboard/blog">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {userPosts.length === 0 ? (
                  <div className="py-8 text-center">
                    <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                    <p className="mb-4 text-muted-foreground">
                      You haven&apos;t created any posts yet.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Post
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPosts.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-medium">{post.title}</h3>
                            <span
                              className={`shrink-0 rounded px-2 py-0.5 text-xs ${
                                post.published
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}
                            >
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {post.excerpt || post.content.slice(0, 80)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                        <div className="ml-4 flex gap-1">
                          {post.published && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/blog/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/blog/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/blog">
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Posts
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/blog" target="_blank">
                    <Globe className="mr-2 h-4 w-4" />
                    View Blog
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blog Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Published</span>
                    <span className="font-medium">{publishedPosts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Published</span>
                    <span className="font-medium">{publishedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Drafts</span>
                    <span className="font-medium">{draftCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
