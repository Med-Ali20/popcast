import { Suspense } from "react";
import ArticleClientPage from "./ArticleClientPage";

export const dynamic = "force-dynamic"; // prevent prerender crash

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="min-h-[90vh]">Loading articles...</div>}>
      <ArticleClientPage />
    </Suspense>
  );
}
