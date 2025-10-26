import { Suspense } from "react";
import PodcastClientPage from "./PodcastClientPage";

export const dynamic = "force-dynamic"; // prevent prerender crash

export default function PodcastPage() {
  return (
    <Suspense fallback={<div className="min-h-[90vh]">Loading podcasts...</div>}>
      <PodcastClientPage />
    </Suspense>
  );
}
