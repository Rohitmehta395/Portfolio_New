import { MDXRemote } from 'next-mdx-remote/rsc';

interface MDXRendererProps {
  source: string;
}

/**
 * Server Component rendering database-stored MDX content strings via next-mdx-remote/rsc.
 */
export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose prose-invert max-w-none font-sans text-secondary-foreground leading-relaxed text-base md:text-lg prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight prose-a:text-emerald-400 hover:prose-a:underline prose-code:text-emerald-300 prose-pre:border prose-pre:border-border prose-pre:bg-card prose-blockquote:border-l-emerald-500 prose-blockquote:text-muted-foreground">
      <MDXRemote source={source} />
    </div>
  );
}

export default MDXRenderer;
