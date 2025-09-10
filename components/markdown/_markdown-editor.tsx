"use client";

import { Ref } from "react";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { cn } from "@/lib/utils";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertTable,
  InsertThematicBreak,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

// tailwind auto style markdown text
export const markdownClassnNames =
  "max-w-none pruse pruse-neutral dark:pruse-invert font-sans";

export default function InternalMDXMarkdownEditor({
  ref,
  className,
  ...props
}: MDXEditorProps & { ref: Ref<MDXEditorMethods> }) {
  const isDarkMode = useIsDarkMode();

  return (
    <MDXEditor
      {...props}
      ref={ref}
      suppressHtmlProcessing
      className={cn(markdownClassnNames, isDarkMode && "dark-theme", className)}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertThematicBreak />
              <InsertTable />
            </>
          ),
        }),
      ]}
    />
  );
}
