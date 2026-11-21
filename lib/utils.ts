import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeAiMdx(markdown: string): string {
  return (
    markdown
      // 1. Convert <br>, <br/>, <BR>, <br > -> valid self-closing JSX <br /> (preserves line breaks in tables!)
      .replace(/<br\s*\/?>/gi, "<br />")
      // 2. Convert <hr> -> Markdown divider
      .replace(/<hr\s*\/?>/gi, "\n---\n")
      // 3. Escape lone '<' followed by digits or spaces (e.g., "< 3 years" -> "&lt; 3 years")
      .replace(/<(?=\s|\d)/g, "&lt;")
      // 4. Escape curly braces outside code blocks so MDX doesn't treat {text} as a JS expression
      .replace(/\{/g, "&#123;")
      .replace(/\}/g, "&#125;")
      .trim()
  );
}
