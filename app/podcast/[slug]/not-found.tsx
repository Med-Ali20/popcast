export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center" dir="rtl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">الحلقة غير موجودة</h2>
        <p className="text-gray-600 mb-6">عذراً، لم نتمكن من العثور على الحلقة المطلوبة</p>
        <a 
          href="/podcast" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          العودة إلى البودكاست
        </a>
      </div>
    </div>
  );
}