"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

function parseItinerary(text: string) {
  if (typeof text !== "string") throw new TypeError("text must be a string");

  // Find each block that starts with [HH:MM] up to the next [HH:MM] or end.
  const blocks =
    text.match(/\[\d{2}:\d{2}\][\s\S]*?(?=(\[\d{2}:\d{2}\])|$)/g) || [];

  const cleaned = blocks.map((raw) => {
    let s = raw.trim();

    // Normalize multiple spaces
    s = s.replace(/\s{2,}/g, " ");

    return `- ${s}`;
  });

  return cleaned.join("\n");
}

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const aff = parseItinerary(markdown);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-6 mb-3 leading-tight text-slate-900">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-5 mb-2 leading-tight text-slate-900">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-4 mb-2 leading-tight text-slate-800">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-medium mt-3 mb-2 leading-tight text-slate-700">
            {children}
          </h4>
        ),

        p: ({ children }) => (
          <p className="text-[15px] leading-relaxed text-slate-700 mb-3">
            {children}
          </p>
        ),

        strong: ({ children }) => (
          <strong className="font-semibold text-[#0EA5E9]">{children}</strong>
        ),

        em: ({ children }) => (
          <em className="italic text-slate-800">{children}</em>
        ),

        ul: ({ children }) => (
          <ul className="list-disc pl-6 space-y-2 mb-3">{children} </ul>
        ),

        ol: ({ children }) => (
          <ol className="list-decimal pl-6 space-y-2 mb-3">{children}</ol>
        ),

        li: ({ children }) => (
          <li className="hover:translate-x-1 transition-all pr-1 text-base leading-relaxed text-slate-700 marker:text-purple-500">
            {children}
          </li>
        ),

        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-sky-400 pl-4 italic text-slate-600 my-4">
            {children}
          </blockquote>
        ),

        a: ({ children, href }) => (
          <a
            href={href}
            className="text-sky-600 hover:text-sky-700 underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        code: ({ children }) => (
          <code className="px-1 py-0.5 bg-slate-100 rounded text-sm font-mono text-slate-800">
            {children}
          </code>
        ),

        pre: ({ children }) => (
          <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto text-sm my-4">
            {children}
          </pre>
        ),
      }}
    >
      {aff}
    </ReactMarkdown>
  );
}
