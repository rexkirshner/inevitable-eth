import { redirect } from 'next/navigation';
import { getAllContent } from '@/lib/content';

export default function RandomPage() {
  // Get all articles
  const allArticles = getAllContent();

  // Pick random article
  const randomIndex = Math.floor(Math.random() * allArticles.length);
  const randomArticle = allArticles[randomIndex];

  // Redirect to random article
  redirect(`/${randomArticle.category}/${randomArticle.slug}`);
}
