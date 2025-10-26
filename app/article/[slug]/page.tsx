import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleDetailPage from './ArticleDetailPage';

type Props = {
  params: { slug: string };
};

// Helper function to create SEO-friendly description
function createMetaDescription(content: string, maxLength: number = 155): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  if (text.length <= maxLength) return text;
  
  // Find last space within limit
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return text.substring(0, lastSpace) + '...';
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch(`http://3.70.229.133:3001/article/${params.slug}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      return {
        title: 'مقالة غير موجودة | بوب كاست',
        description: 'المقالة المطلوبة غير موجودة في بوب كاست',
      };
    }

    const article = await response.json();
    const description = createMetaDescription(article.content);

    return {
      title: `${article.title} | بوب كاست`,
      description: description,
      keywords: article.tags || ['البوب العربي', 'موسيقى عربية', 'مقالات موسيقية', 'ثقافة شعبية'],
      authors: [{ name: article.author || 'بوب كاست' }],
      
      // Open Graph (Facebook, LinkedIn, WhatsApp)
      openGraph: {
        title: article.title,
        description: description,
        type: 'article',
        publishedTime: article.date,
        modifiedTime: article.updatedAt,
        authors: [article.author || 'بوب كاست'],
        tags: article.tags,
        section: article.category || 'البوب العربي',
        images: [{
          url: article.thumbnail || '/images/default-article-og.jpg',
          width: 1200,
          height: 630,
          alt: article.title,
        }],
        locale: 'ar_EG',
        siteName: 'بوب كاست',
      },
      
      // Twitter Cards
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: description,
        images: [article.thumbnail || '/images/default-article-twitter.jpg'],
        creator: '@popcast', // Replace with your actual Twitter handle
      },
      
      // Canonical URL
      alternates: {
        canonical: `https://itspopcast.com/article/${params.slug}`,
      },
      
      // Additional article-specific metadata
      other: {
        'article:published_time': article.date,
        'article:modified_time': article.updatedAt,
        'article:author': article.author || 'بوب كاست',
        'article:section': article.category || 'البوب العربي',
        'article:tag': article.tags?.join(', '),
      },
    };
  } catch (error) {
    console.error('Error generating article metadata:', error);
    return {
      title: 'خطأ في تحميل المقالة | بوب كاست',
      description: 'حدث خطأ أثناء تحميل المقالة',
    };
  }
}

// Server component that fetches data and passes to client
export default async function ArticlePage({ params }: Props) {
  try {
    const response = await fetch(`http://3.70.229.133:3001/article/${params.slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      notFound();
    }

    const article = await response.json();

    return <ArticleDetailPage initialArticle={article} />;
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}