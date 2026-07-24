import Image from 'next/image';
import Link from 'next/link';
import { TagPill } from '@/features/experience/TagPill';
import { SerializedBlogPost } from '@/lib/validations/blog.schema';

interface BlogCardProps {
  post: SerializedBlogPost;
  className?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Presentational component rendering a single Blog Post preview card.
 * Reuses TagPill from features/experience/TagPill.
 */
export function BlogCard({ post, className = '' }: BlogCardProps) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80 transition-all hover:border-muted-foreground hover:shadow-2xl ${className}`}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
      )}

      {/* Card Details Body */}
      <div className="flex flex-1 flex-col justify-between p-6 gap-6">
        <div className="flex flex-col gap-3">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readTimeMinutes} min read</span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground group-hover:text-neutral-100">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Bottom Tag Pills & Read Link */}
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagPill key={tag} label={tag} variant="ghost" />
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-emerald-400 transition-colors"
          >
            <span>Read Article</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
