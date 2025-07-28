import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { HomepageContent } from "@shared/schema";
import heroImage from "@assets/image_1753710172214.png";

export default function Hero() {
  // Fetch homepage content from database
  const { data: content } = useQuery<HomepageContent>({
    queryKey: ["/api/homepage-content"],
    retry: false,
  });

  // Default values if no content from database
  const heroTitle = content?.heroTitle || "Mầm Non Thảo Nguyên Xanh";
  const heroSubtitle = content?.heroSubtitle || "Nơi nuôi dưỡng tâm hồn - Phát triển tư duy - Xây dựng tương lai";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-green/80 to-secondary-blue/80 z-10"></div>
      
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      ></div>
      
      <div className="relative z-20 text-center text-white container mx-auto px-4">
        <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl mb-6">
          {heroTitle}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admission">
            <Button 
              size="lg" 
              className="bg-accent-yellow hover:bg-accent-yellow/90 text-white px-8 py-4 text-lg font-semibold"
            >
              Đăng ký tuyển sinh
            </Button>
          </Link>
          <Link href="/about">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              Tìm hiểu thêm
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce text-white">
          <i className="fas fa-chevron-down text-2xl"></i>
        </div>
      </div>
    </section>
  );
}
