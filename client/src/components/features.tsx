export default function Features() {
  const features = [
    {
      icon: "fas fa-brain",
      title: "Triết lý giáo dục",
      description: "Giáo dục bằng trái tim, phát triển toàn diện cả trí tuệ và nhân cách cho trẻ",
      color: "primary-green"
    },
    {
      icon: "fas fa-puzzle-piece",
      title: "Chương trình tích hợp",
      description: "Kết hợp Montessori, Glenn Doman, STEAM để phát triển đa dạng kỹ năng",
      color: "secondary-blue"
    },
    {
      icon: "fas fa-users",
      title: "Đội ngũ chuyên nghiệp",
      description: "Giáo viên được đào tạo bài bản, tâm huyết và giàu kinh nghiệm",
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
