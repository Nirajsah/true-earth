import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

type MarkdownRendererProps = {
  content: string
  className?: string
  isStreaming?: boolean
}

const MarkdownRenderer = ({
  content,
  className,
  isStreaming = false,
}: MarkdownRendererProps) => {
  // Helper function to check if markdown might be incomplete
  const isMarkdownIncomplete = (text: string): boolean => {
    if (!isStreaming) return false

    // Check for incomplete code blocks
    const codeBlockMatches = text.match(/```/g)
    if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
      return true
    }

    // Check for incomplete inline code
    const inlineCodeMatches = text.match(/`/g)
    if (inlineCodeMatches && inlineCodeMatches.length % 2 !== 0) {
      return true
    }

    // Check for incomplete links
    if (text.match(/\[([^\]]*)?$/)) {
      return true
    }

    // Check for incomplete images
    if (text.match(/!\[([^\]]*)?$/)) {
      return true
    }

    // Check for incomplete tables (table rows that don't end with |)
    const lines = text.split('\n')
    const lastLine = lines[lines.length - 1]
    if (lastLine && lastLine.includes('|') && !lastLine.trim().endsWith('|')) {
      return true
    }

    return false
  }

  // If markdown appears incomplete, render as plain text with basic formatting
  if (isMarkdownIncomplete(content)) {
    return (
      <div className={cn('whitespace-pre-wrap leading-normal', className)}>
        {content}
        <span className="animate-pulse">|</span>
      </div>
    )
  }

  return (
    <div
      className={cn('prose prose-sm dark:prose-invert max-w-none', className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-normal">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-4 mb-3 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-4 mb-3 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          // @ts-ignore
          code: ({ node, inline, className, children, ...props }) => {
            return !inline ? (
              <pre className="bg-muted/50 p-3 rounded-lg mb-3 last:mb-0 overflow-x-auto">
                <code className={cn('text-sm', className)} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-muted/50 px-1.5 py-0.5 rounded text-[0.9em]"
                {...props}
              >
                {children}
              </code>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground/20 pl-4 italic mb-3 last:mb-0">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto my-2"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3 last:mb-0">
              <table className="min-w-full divide-y divide-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-sm font-medium bg-muted">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="animate-pulse text-muted-foreground">|</span>
      )}
    </div>
  )
}

export default MarkdownRenderer
