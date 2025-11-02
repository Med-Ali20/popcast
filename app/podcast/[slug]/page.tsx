import { Metadata } from "next";
import { notFound } from "next/navigation";
import PodcastDetailPage from "./PodcastDetailPage";

type Props = {
  params: { slug: string };
};

function createMetaDescription(
  description: string,
  maxLength: number = 155
): string {
  if (!description) {
    return "استمع إلى هذه الحلقة المميزة من بوب كاست - قصص من وراء كواليس البوب العربي";
  }

  const text = description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return text.substring(0, lastSpace) + "...";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/podcast/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        title: "حلقة بودكاست غير موجودة | بوب كاست",
        description: "الحلقة المطلوبة غير موجودة في بوب كاست",
      };
    }

    const podcast = await response.json();
    const description = createMetaDescription(podcast.description);
    const categoryName = podcast.category?.name || "بودكاست";

    return {
      title: `${podcast.title} | بوب كاست`,
      description: description,
      keywords: podcast.tags || [
        "بودكاست عربي",
        "البوب العربي",
        "موسيقى عربية",
        "كواليس الفن",
        "حوارات موسيقية",
        categoryName,
      ],

      openGraph: {
        title: podcast.title,
        description: description,
        type: "music.song",
        url: `https://itspopcast.com/podcast/${slug}`,
        images: [
          {
            url: podcast.thumbnailUrl || "/images/default-podcast-og.jpg",
            width: 1200,
            height: 630,
            alt: podcast.title,
          },
        ],
        locale: "ar_EG",
        siteName: "بوب كاست",
        audio: podcast.audioUrl
          ? [
              {
                url: podcast.audioUrl,
                type: "audio/mpeg",
              },
            ]
          : undefined,
      },

      twitter: {
        card: "summary_large_image",
        title: podcast.title,
        description: description,
        images: [podcast.thumbnailUrl || "/images/default-podcast-twitter.jpg"],
        creator: "@popcast",
      },

      alternates: {
        canonical: `https://itspopcast.com/podcast/${slug}`,
      },

      other: {
        "music:duration": podcast.duration?.toString(),
        "music:musician": "بوب كاست",
        "og:audio": podcast.audioUrl,
        "og:audio:type": "audio/mpeg",
        "og:video": podcast.videoUrl,
      },
    };
  } catch (error) {
    console.error("Error generating podcast metadata:", error);
    return {
      title: "خطأ في تحميل البودكاست | بوب كاست",
      description: "حدث خطأ أثناء تحميل البودكاست",
    };
  }
}

export default async function PodcastPage({ params }: Props) {
  const { slug } = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/podcast/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      notFound();
    }

    const podcast = await response.json();

    return <PodcastDetailPage initialPodcast={podcast} />;
  } catch (error) {
    console.error("Error fetching podcast:", error);
    notFound();
  }
}
