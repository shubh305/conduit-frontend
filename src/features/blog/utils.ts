import { TiptapContent, TiptapNode } from "./types";

/**
 * Extracts plain text from Tiptap JSON content
 */
export function extractTextFromTiptap(content: TiptapContent): string {
  try {
    const texts: string[] = [];
    const traverse = (node: TiptapNode) => {
      if (node.text) texts.push(node.text);
      if (node.content) node.content.forEach(traverse);
    };
    if (content.content) {
      content.content.forEach(traverse);
    }
    return texts.join(" ");
  } catch (error) {
    console.error("Failed to extract text from Tiptap content", error);
    return "";
  }
}

/**
 * Calculates word count, paragraph count and reading time
 */
export function calculateReadingStats(content: TiptapContent) {
  const text = extractTextFromTiptap(content);

  const words = text
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0);
  const wordCount = words.length;

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  let paragraphsCount = 0;
  if (content.content) {
    paragraphsCount = content.content.filter(node => node.type === "paragraph").length;
  }

  if (paragraphsCount === 0 && text.length > 0) {
    paragraphsCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  }

  return { wordCount, readingTimeMinutes, paragraphsCount };
}

/**
 * Generates a URL-friendly slug from a string
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
