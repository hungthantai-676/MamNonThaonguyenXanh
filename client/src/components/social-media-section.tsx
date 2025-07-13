import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, Heart, Share2 } from "lucide-react";
import { FaFacebook, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

interface SocialMediaLink {
  id: number;
  platform: string;
  url: string;
  displayName: string;
  followers: number;
  isActive: boolean;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <FaFacebook className="w-6 h-6 text-blue-600" />;
    case 'youtube':
      return <FaYoutube className="w-6 h-6 text-red-600" />;
    case 'instagram':
      return <FaInstagram className="w-6 h-6 text-pink-600" />;
    case 'tiktok':
      return <FaTiktok className="w-6 h-6 text-black" />;
    default:
      return <Share2 className="w-6 h-6 text-gray-600" />;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    case 'youtube':
      return 'bg-red-50 border-red-200 hover:bg-red-100';
    case 'instagram':
      return 'bg-pink-50 border-pink-200 hover:bg-pink-100';
    case 'tiktok':
      return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    default:
      return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  }
};

const handleFollowClick = (url: string, platform: string) => {
  // Mở link trong tab mới
  window.open(url, '_blank');
  
  // Thêm tracking event nếu cần
  console.log(`User clicked follow on ${platform}`);
};

export default function SocialMediaSection() {
  const { data: socialLinks, isLoading } = useQuery<SocialMediaLink[]>({
    queryKey: ["/api/social-media"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Theo dõi chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cập nhật hoạt động mới nhất của trường, những khoảnh khắc vui vẻ và thông tin giáo dục bổ ích
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {socialLinks.map((link) => (
            <Card key={link.id} className={`${getPlatformColor(link.platform)} transition-all duration-300 hover:shadow-lg`}>
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  {getPlatformIcon(link.platform)}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {link.displayName || `@MamNonThaoNguyenXanh`}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                {link.followers > 0 && (
                  <div className="flex items-center justify-center mb-4">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {link.followers.toLocaleString()} người theo dõi
                    </span>
                  </div>
                )}
                
                <Button
                  onClick={() => handleFollowClick(link.url, link.platform)}
                  className="w-full bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Theo dõi
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ để lan tỏa niềm vui học tập
          </Badge>
        </div>
      </div>
    </section>
  );
}