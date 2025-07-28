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
      {/* Background Image - Full screen with proper sizing */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      ></div>
      
      {/* Content positioned in bottom 1/5 of screen */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Spacer - 4/5 of screen */}
        <div className="flex-grow-4" style={{ flex: '4' }}></div>
        
        {/* Main content in bottom 1/5 */}
        <div className="bg-gradient-to-r from-primary-green to-secondary-blue py-8" style={{ flex: '1' }}>
          <div className="text-center text-white container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-4 drop-shadow-2xl">
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg mb-6 max-w-3xl mx-auto drop-shadow-lg">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admission">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🌟 ĐĂNG KÝ TUYỂN SINH 🌟
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-lg font-semibold rounded-full shadow-xl"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
