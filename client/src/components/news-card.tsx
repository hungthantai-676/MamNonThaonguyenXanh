import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import type { Article } from "@shared/schema";

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="bg-light-gray rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={article.imageUrl || "https://images.unsplash.com/photo-1497486751825-1233686d5d80"} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <i className="fas fa-calendar-alt mr-2"></i>
          <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
        </div>
        <h3 className="font-semibold text-lg text-dark-gray mb-3">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {article.excerpt}
        </p>
        <Link href={`/news/${article.id}`}>
          <span 
            className="text-primary-green font-medium hover:text-primary-green/80 cursor-pointer"
            onClick={() => {
              console.log('Clicked read more for article ID:', article.id);
              console.log('Navigating to:', `/news/${article.id}`);
            }}
          >
            Đọc thêm <i className="fas fa-arrow-right ml-1"></i>
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
