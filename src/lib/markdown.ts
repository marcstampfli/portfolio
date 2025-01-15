import { marked } from "marked";

export function renderMarkdown(content: string) {
  return marked(content, {
    gfm: true,
    breaks: true,
  });
}
