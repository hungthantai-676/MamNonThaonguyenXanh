import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import type { Article } from "@shared/schema";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['/api/articles', id],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${id}`);
      if (!response.ok) {
        throw new Error('Bài viết không tồn tại');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-gray-600 mb-8">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link href="/news">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại tin tức
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/news">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại tin tức
            </Button>
          </Link>

          {/* Article header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {article.imageUrl && (
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <span className="capitalize">{article.category}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <div className="text-xl text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-green">
                  {article.excerpt}
                </div>
              )}

              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-primary-green prose-strong:text-gray-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>

          {/* Back to news */}
          <div className="mt-8 text-center">
            <Link href="/news">
              <Button size="lg" className="bg-primary-green hover:bg-primary-green/90">
                Xem thêm tin tức khác
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}