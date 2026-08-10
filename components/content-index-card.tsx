import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Folder } from "lucide-react";
import type { ContentIndexEntry } from "@/lib/content-index";
import { getCategoryName } from "@/lib/taxonomy";

export function ContentIndexCard({ entry }: { entry: ContentIndexEntry }) {
  const categoryName = getCategoryName(entry.category);
  return <article className="blog-post-card">
    <Link href={entry.href} prefetch={false}>
      {entry.coverImage && <div className="post-card-cover"><Image src={entry.coverImage} alt={entry.coverAlt || ""} fill sizes="(max-width: 780px) 100vw, 760px" /></div>}
      <div className="post-card-top"><span>{entry.kind} · {categoryName}</span><span>{entry.readingMinutes}분</span></div>
      <h2>{entry.title}</h2>
      <p>{entry.description}</p>
      <div className="post-card-meta"><span><CalendarDays size={14} />{entry.date}</span><span><Folder size={14} />{entry.kind}</span></div>
      {entry.tags.length > 0 && <div className="tag-row">{entry.tags.slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}</div>}
    </Link>
  </article>;
}
