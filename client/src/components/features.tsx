import { useQuery } from "@tanstack/react-query";
import type { HomepageContent } from "@shared/schema";

export default function Features() {
  // Fetch homepage content from database
  const { data: content } = useQuery<HomepageContent>({
    queryKey: ["/api/homepage-content"],
    retry: false,
  });

  // Default feature data
  const highlight1Title = content?.highlight1Title || "Chương trình đào tạo tiên tiến";
  const highlight1Desc = content?.highlight1Desc || "Áp dụng phương pháp giáo dục Montessori và STEAM, giúp trẻ phát triển toàn diện";
  const highlight2Title = content?.highlight2Title || "Cơ sở vật chất hiện đại";
  const highlight2Desc = content?.highlight2Desc || "Khuôn viên rộng rãi, an toàn, trang thiết bị học tập đầy đủ, hiện đại";
  const highlight3Title = content?.highlight3Title || "Đội ngũ giáo viên chuyên nghiệp";
  const highlight3Desc = content?.highlight3Desc || "100% giáo viên có bằng cấp chuyên môn, tận tâm với nghề và yêu thương trẻ";
  const features = [
    {
      icon: "fas fa-graduation-cap",
      title: highlight1Title,
      description: highlight1Desc,
      color: "primary-green"
    },
    {
      icon: "fas fa-building",
      title: highlight2Title,
      description: highlight2Desc,
      color: "secondary-blue"
    },
    {
      icon: "fas fa-users-cog",
      title: highlight3Title,
      description: highlight3Desc,
      color: "accent-yellow"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl text-dark-gray mb-4">Điểm nổi bật</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Phương pháp giáo dục tiên tiến kết hợp với môi trường học tập thân thiện
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 bg-${feature.color}/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-${feature.color}/20 transition-colors`}>
                <i className={`${feature.icon} text-${feature.color} text-3xl`}></i>
              </div>
              <h3 className="font-semibold text-xl text-dark-gray mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
