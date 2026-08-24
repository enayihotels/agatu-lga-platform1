import { Link } from "react-router-dom";

import type { NewsPostListItem } from "@/schemas/news";

export default function NewsPostCard({ post }: { post: NewsPostListItem }) {
  return (
    <Link
      to={`/news/${post.slug}`}
      className="block rounded-lg border border-agatu-earth-200 bg-white p-4 hover:border-agatu-river-300"
    >
      {post.category_name && (
        <span className="text-xs font-medium uppercase text-agatu-river-600">
          {post.category_name}
        </span>
      )}
      <h3 className="mt-1 font-semibold text-agatu-earth-900">{post.title}</h3>
      {post.excerpt && (
        <p className="mt-1 text-sm text-agatu-earth-600">{post.excerpt}</p>
      )}
      <div className="mt-2 flex gap-3 text-xs text-agatu-earth-500">
        {post.ward_name && <span>{post.ward_name}</span>}
        {post.author_name && <span>{post.author_name}</span>}
        {post.published_at && (
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
        )}
      </div>
    </Link>
  );
}
