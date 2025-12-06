"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export function MarkdownRenderer({ markdown }: { markdown: string }) {
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
          <ol className="list-decimal pl-6 space-y-2 py-1">{children}</ol>
        ),

        li: ({ children }) => (
          <li className="hover:translate-x-1 transition-all pr-1 text-base leading-relaxed text-slate-700 marker:text-purple-500 in-[ol]:text-sm in-[ol]:mb-0">
            {children}
          </li>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
