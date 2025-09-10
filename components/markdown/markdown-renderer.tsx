import { markdownClassnNames } from "./_markdown-editor";

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGFM from "remark-gfm";

import { cn } from "@/lib/utils";

type Props = { props: MDXRemoteProps; className?: string };

export default function MarkdownRenderder({
  props: { options, ...props },
  className = "",
}: Props) {
  return (
    <div className={cn(markdownClassnNames, className)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGFM,
              ...(options?.mdxOptions?.remarkPlugins ?? []),
            ],
          },
          ...options?.mdxOptions,
        }}
      />
    </div>
  );
}
