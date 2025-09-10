import dynamic from "next/dynamic";

export const MDXMarkdownEditor = dynamic(() => import("./_markdown-editor"), {
  ssr: false,
});
