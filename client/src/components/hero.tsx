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
    <section className="relative h-screen overflow-hidden">
      {/* Background Image - Only upper portion */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          height: '50%' // Only cover top half
        }}
      ></div>
      
      {/* Lower solid background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-r from-primary-green to-secondary-blue"></div>
      
      {/* Content positioned in lower section */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Spacer for upper image area */}
        <div className="flex-1"></div>
        
        {/* Main content in lower solid area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white container mx-auto px-4">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 drop-shadow-2xl">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow-lg">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/admission">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white"
                >
                  🌟 ĐĂNG KÝ NGAY 🌟
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-green px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce text-white">
          <i className="fas fa-chevron-down text-2xl drop-shadow-lg"></i>
        </div>
      </div>
    </section>
  );
}
