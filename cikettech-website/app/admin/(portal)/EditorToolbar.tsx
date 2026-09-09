"use client";

import { RefObject } from "react";
import { UnderlineIcon, BulletListIcon, NumberedListIcon, LinkIcon, ImageIcon } from "../../components/admin-icons";

function wrapSelection(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
  before: string,
  after: string = before
) {
  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;
  const selected = value.slice(start, end) || "text";
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = start + before.length;
    el.selectionEnd = start + before.length + selected.length;
  });
}

function prefixLines(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
  prefixFn: (line: string, i: number) => string
) {
  const start = el.selectionStart ?? 0;
  const end = el.selectionEnd ?? value.length;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const newBlock = block
    .split("\n")
    .map((line, i) => prefixFn(line, i))
    .join("\n");
  onChange(value.slice(0, lineStart) + newBlock + value.slice(lineEnd));
  requestAnimationFrame(() => el.focus());
}

export default function EditorToolbar({
  textareaRef,
  value,
  onChange,
  withImage = false,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
  withImage?: boolean;
}) {
  function apply(fn: (el: HTMLTextAreaElement) => void) {
    const el = textareaRef.current;
    if (el) fn(el);
  }

  return (
    <div className="admin-editor-toolbar">
      <button type="button" aria-label="Bold" onClick={() => apply((el) => wrapSelection(el, value, onChange, "**"))}>
        <strong>B</strong>
      </button>
      <button type="button" aria-label="Italic" onClick={() => apply((el) => wrapSelection(el, value, onChange, "_"))}>
        <em>I</em>
      </button>
      <button
        type="button"
        aria-label="Underline"
        onClick={() => apply((el) => wrapSelection(el, value, onChange, "<u>", "</u>"))}
      >
        <UnderlineIcon />
      </button>
      <span className="admin-toolbar-divider" />
      <button
        type="button"
        aria-label="Bullet list"
        onClick={() =>
          apply((el) =>
            prefixLines(el, value, onChange, (line) => (line.startsWith("- ") ? line : "- " + line))
          )
        }
      >
        <BulletListIcon />
      </button>
      <button
        type="button"
        aria-label="Numbered list"
        onClick={() =>
          apply((el) =>
            prefixLines(el, value, onChange, (line, i) => `${i + 1}. ${line.replace(/^\d+\.\s*/, "")}`)
          )
        }
      >
        <NumberedListIcon />
      </button>
      <span className="admin-toolbar-divider" />
      <button
        type="button"
        aria-label="Insert link"
        onClick={() =>
          apply((el) => {
            const url = window.prompt("Link URL:", "https://");
            if (url) wrapSelection(el, value, onChange, "[", `](${url})`);
          })
        }
      >
        <LinkIcon />
      </button>
      {withImage && (
        <button
          type="button"
          aria-label="Insert image"
          onClick={() =>
            apply((el) => {
              const url = window.prompt("Image URL:", "https://");
              if (url) wrapSelection(el, value, onChange, "![", `](${url})`);
            })
          }
        >
          <ImageIcon />
        </button>
      )}
    </div>
  );
}
