"use client";

import { useState } from "react";

/** Pass -1 anywhere in `pages` to render a static "…" gap at that position (e.g. [1, 2, 3, -1, 14]). */
export default function AdminPagination({
  pages,
  prevLabel = "Previous",
  nextLabel = "Next",
}: {
  pages: number[];
  prevLabel?: string;
  nextLabel?: string;
}) {
  const realPages = pages.filter((p) => p !== -1);
  const [active, setActive] = useState(realPages[0]);
  const idx = realPages.indexOf(active);
  const singlePage = realPages.length <= 1;

  function go(target: number) {
    if (realPages.includes(target)) setActive(target);
  }

  return (
    <div className="admin-pagination">
      <button type="button" disabled={singlePage || idx <= 0} onClick={() => go(realPages[idx - 1])}>
        {prevLabel}
      </button>
      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`gap-${i}`} className="admin-pagination-ellipsis">
            &hellip;
          </span>
        ) : (
          <button key={p} type="button" className={p === active ? "active" : ""} onClick={() => go(p)}>
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={singlePage || idx >= realPages.length - 1}
        onClick={() => go(realPages[idx + 1])}
      >
        {nextLabel}
      </button>
    </div>
  );
}
