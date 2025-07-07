export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green/10 to-secondary-blue/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl text-dark-gray mb-4">
            Giới thiệu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu về sứ mệnh, tầm nhìn và giá trị cốt lõi của Mầm Non Thảo Nguyên Xanh
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-bold text-3xl text-dark-gray mb-6">Lịch sử hình thành</h2>
              <p className="text-gray-700 mb-6">
                Mầm Non Thảo Nguyên Xanh được thành lập vào năm 2015 với khát vọng tạo nên một 
                môi trường giáo dục lý tưởng cho trẻ em. Từ những ngày đầu khiêm tốn với chỉ 
                30 học sinh, chúng tôi đã không ngừng phát triển và hoàn thiện.
              </p>
              <p className="text-gray-700 mb-6">
                Trải qua gần 10 năm xây dựng và phát triển, nhà trường hiện có hơn 300 học sinh 
                với đội ngũ giáo viên giàu kinh nghiệm và tận tâm. Chúng tôi tự hào là một trong 
                những trường mầm non uy tín hàng đầu tại khu vực.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-green mb-2">300+</div>
                  <div className="text-gray-600">Học sinh</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-blue mb-2">25+</div>
                  <div className="text-gray-600">Giáo viên</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-yellow mb-2">10+</div>
                  <div className="text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-green mb-2">15+</div>
                  <div className="text-gray-600">Giải thưởng</div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b" 
                alt="School building" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Sứ mệnh - Tầm nhìn - Giá trị</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những giá trị cốt lõi định hướng hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-heart text-primary-green text-2xl"></i>
              </div>
              <h3 className="font-semibold text-xl text-dark-gray mb-4">Sứ mệnh</h3>
              <p className="text-gray-600">
                Giáo dục trẻ em bằng trái tim, phát triển toàn diện nhân cách và tạo nền tảng 
                vững chắc cho tương lai của các em.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-eye text-secondary-blue text-2xl"></i>
              </div>
              <h3 className="font-semibold text-xl text-dark-gray mb-4">Tầm nhìn</h3>
              <p className="text-gray-600">
                Trở thành ngôi trường mầm non hàng đầu trong khu vực, được tin tưởng bởi 
                phụ huynh và yêu mến bởi trẻ em.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-gem text-accent-yellow text-2xl"></i>
              </div>
              <h3 className="font-semibold text-xl text-dark-gray mb-4">Giá trị cốt lõi</h3>
              <p className="text-gray-600">
                Yêu thương - Tôn trọng - Sáng tạo - Phát triển. Những giá trị này là kim chỉ nam 
                cho mọi hoạt động giáo dục.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Đội ngũ giáo viên</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Đội ngũ giáo viên giàu kinh nghiệm, tận tâm và được đào tạo chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Cô Nguyễn Thị Hoa",
                role: "Hiệu trưởng",
                experience: "15 năm kinh nghiệm",
                image: "https://images.unsplash.com/photo-1559209172-91b75b67d7f8"
              },
              {
                name: "Cô Trần Thị Mai",
                role: "Phó hiệu trưởng",
                experience: "12 năm kinh nghiệm",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              },
              {
                name: "Cô Lê Thị Lan",
                role: "Giáo viên chủ nhiệm",
                experience: "8 năm kinh nghiệm",
                image: "https://images.unsplash.com/photo-1554151228-14d9def656e4"
              },
              {
                name: "Cô Phạm Thị Hương",
                role: "Giáo viên chủ nhiệm",
                experience: "6 năm kinh nghiệm",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
              }
            ].map((teacher, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-green text-white px-3 py-1 rounded-full text-sm">
                    {teacher.role}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-dark-gray mb-2">{teacher.name}</h3>
                <p className="text-gray-600">{teacher.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Cơ sở vật chất</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Môi trường học tập hiện đại, an toàn và thân thiện với trẻ em
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Phòng học hiện đại",
                description: "Được trang bị đầy đủ thiết bị học tập, điều hòa nhiệt độ và ánh sáng tự nhiên",
                image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b"
              },
              {
                title: "Sân chơi an toàn",
                description: "Khu vực vui chơi rộng rãi với các thiết bị đảm bảo an toàn tuyệt đối",
                image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643"
              },
              {
                title: "Phòng ăn sạch sẽ",
                description: "Không gian ăn uống thoáng mát, đảm bảo vệ sinh thực phẩm",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
              },
              {
                title: "Khu vực nghỉ ngơi",
                description: "Phòng ngủ trưa thoáng mát, yên tĩnh để các em có giấc ngủ chất lượng",
                image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9"
              },
              {
                title: "Thư viện",
                description: "Tủ sách phong phú với nhiều đầu sách phù hợp cho trẻ em",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              },
              {
                title: "Khu vực y tế",
                description: "Phòng y tế được trang bị đầy đủ để chăm sóc sức khỏe các em",
                image: "https://images.unsplash.com/photo-1559209172-91b75b67d7f8"
              }
            ].map((facility, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={facility.image} 
                  alt={facility.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-dark-gray mb-3">{facility.title}</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Thành tích & Giải thưởng</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những thành tích nổi bật mà chúng tôi đã đạt được
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                year: "2023",
                title: "Trường mầm non xuất sắc cấp thành phố",
                description: "Được công nhận bởi Sở Giáo dục & Đào tạo"
              },
              {
                year: "2022",
                title: "Giải nhất hội thi giáo viên giỏi",
                description: "Cô Nguyễn Thị Hoa đạt giải nhất cấp quận"
              },
              {
                year: "2021",
                title: "Trường đạt chuẩn quốc gia mức độ 2",
                description: "Được Bộ Giáo dục & Đào tạo công nhận"
              },
              {
                year: "2020",
                title: "Giải thưởng môi trường xanh",
                description: "Được UBND thành phố trao tặng"
              },
              {
                year: "2019",
                title: "Tập thể lao động xuất sắc",
                description: "Công đoàn Giáo dục thành phố trao tặng"
              },
              {
                year: "2018",
                title: "Trường tiên tiến trong đổi mới",
                description: "Phòng Giáo dục & Đào tạo công nhận"
              }
            ].map((award, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-green/5 to-secondary-blue/5 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-trophy text-white text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-primary-green">{award.year}</div>
                </div>
                <h3 className="font-semibold text-lg text-dark-gray mb-2">{award.title}</h3>
                <p className="text-gray-600">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
