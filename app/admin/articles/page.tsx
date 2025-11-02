"use client";


import dynamic from 'next/dynamic';

const ArticleUpload = dynamic(() => import('./ArticleUploadComponent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  ),
});

export default function ArticlesPage() {
  return <ArticleUpload />;
}