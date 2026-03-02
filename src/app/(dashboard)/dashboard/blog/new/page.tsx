'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/features/blog/actions';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NewBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Title and content are required',
      });
      setLoading(false);
      return;
    }

    const result = await createPost({
      title,
      content,
      excerpt,
      coverImage,
      published,
    });

    if (result?.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
      setLoading(false);
      return;
    }

    toast({
      title: 'Success',
      description: published ? 'Post published!' : 'Post saved as draft.',
    });
    router.push('/dashboard/blog');
    router.refresh();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <Edit3 className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter post title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief summary of your post"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    {showPreview ? (
                      <div className="prose prose-stone dark:prose-invert min-h-[400px] rounded-lg border p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content || '*No content yet*'}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea
                        id="content"
                        placeholder="Write your post content in Markdown..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                        required
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your post</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      placeholder="https://..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                    />
                    {coverImage && (
                      <div className="mt-2 aspect-video overflow-hidden rounded-lg">
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="published" className="font-normal">
                      Publish immediately
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : published ? (
                      'Publish Post'
                    ) : (
                      'Save Draft'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
