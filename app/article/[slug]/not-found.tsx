import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="text-center max-w-md px-4" dir="rtl">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          المقالة غير موجودة
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          عذراً، لم نتمكن من العثور على المقالة المطلوبة. قد تكون قد تم حذفها أو نقلها.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/article" 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            تصفح المقالات
          </Link>
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}