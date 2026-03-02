import Link from 'next/link';
import { ArrowRight, BookOpen, PenTool, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">Hacker News</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              A space to explore ideas, share insights, and document the journey through technology,
              development, and beyond.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Read the Blog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">What You&apos;ll Find Here</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tech Articles</h3>
              <p className="text-muted-foreground">
                In-depth tutorials, guides, and insights on modern web development and technology.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <PenTool className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Practical Guides</h3>
              <p className="text-muted-foreground">
                Step-by-step tutorials to help you build real projects and learn new skills.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Open Thoughts</h3>
              <p className="text-muted-foreground">
                Personal perspectives on software development, career growth, and the tech industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Start Reading</h2>
            <p className="mb-8 text-muted-foreground">
              Browse through our collection of articles and find something that interests you.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hacker News. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
