'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getPublishedPosts() {
  return db.blogPost.findMany({
    where: { published: true },
    include: {
      getSessionor: {
        select: { name: true, image: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getPostBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug },
    include: {
      getSessionor: {
        select: { name: true, image: true, email: true },
      },
    },
  });
}

export async function getUserPosts() {
  const session = await getSession();
  if (!session?.user?.id) return [];

  return db.blogPost.findMany({
    where: { getSessionorId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: 'UngetSessionorized' };
  }

  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existingPost = await db.blogPost.findUnique({
    where: { slug },
  });

  const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug;

  const post = await db.blogPost.create({
    data: {
      title: data.title,
      slug: finalSlug,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      published: data.published || false,
      getSessionorId: session.user.id,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');

  return { success: true, post };
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
  }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: 'UngetSessionorized' };
  }

  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post || post.getSessionorId !== session.user.id) {
    return { error: 'Not found' };
  }

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.published && !post.published ? new Date() : post.publishedAt,
    },
  });

  revalidatePath('/blog');
  revalidatePath('/blog/' + post.slug);
  revalidatePath('/dashboard/blog');

  return { success: true, post: updated };
}

export async function deletePost(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: 'UngetSessionorized' };
  }

  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post || post.getSessionorId !== session.user.id) {
    return { error: 'Not found' };
  }

  await db.blogPost.delete({ where: { id } });

  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');

  return { success: true };
}
