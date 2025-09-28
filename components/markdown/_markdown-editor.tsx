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
import { markdownClassNames } from "./markdown-renderer";

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
      className={cn(markdownClassNames, isDarkMode && "dark-theme", className)}
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
