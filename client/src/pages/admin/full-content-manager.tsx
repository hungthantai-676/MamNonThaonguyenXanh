import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Image, 
  Users, 
  BookOpen, 
  Activity, 
  UserPlus, 
  Newspaper, 
  Phone,
  Save,
  Edit,
  Trash2,
  Plus,
  Upload,
  Eye,
  Settings,
  GraduationCap,
  Heart,
  Mail
} from "lucide-react";

// Component upload ảnh
const ImageUploader = ({ onImageUpload, currentImage }: { onImageUpload: (url: string) => void, currentImage?: string }) => {
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {currentImage && (
        <img src={currentImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
      )}
      {uploading && <p className="text-sm text-gray-500">Đang tải lên...</p>}
    </div>
  );
};

// Quản lý trang chủ với tất cả thư mục con
const HomeManager = () => {
  const [activeSubTab, setActiveSubTab] = useState("hero");
  const [homeData, setHomeData] = useState({
    // Hero Section
    heroTitle: "Mầm Non Thảo Nguyên Xanh",
    heroSubtitle: "Giáo dục sáng tạo - Ươm mầm tương lai",
    heroImage: "",
    heroButtonText: "Tìm hiểu thêm",
    
    // Features Section
    features: [
      {
        id: 1,
        title: "Phương pháp giáo dục hiện đại",
        description: "Áp dụng các phương pháp giáo dục tiên tiến",
        icon: "🎓",
        image: ""
      }
    ],
    
    // Why Choose Us Section
    whyChooseUs: {
      title: "Tại sao chọn Mầm Non Thảo Nguyên Xanh?",
      items: [
        {
          title: "Đội ngũ giáo viên chuyên nghiệp",
          description: "100% giáo viên có bằng cấp chuyên môn",
          icon: "👩‍🏫"
        }
      ]
    },
    
    // Statistics Section
    statistics: {
      students: "500+",
      teachers: "50+",
      years: "15+",
      awards: "20+"
    },
    
    // Testimonials Display Settings
    testimonialSettings: {
      showOnHomepage: true,
      maxDisplay: 6,
      autoRotate: true,
      rotateInterval: 5000
    },
    
    // Call to Action Section
    ctaSection: {
      title: "Đăng ký tham quan trường ngay hôm nay!",
      subtitle: "Hãy đến và trải nghiệm môi trường giáo dục tuyệt vời của chúng tôi",
      buttonText: "Đăng ký ngay",
      backgroundImage: "",
      showPhone: true,
      showEmail: true
    }
  });

  const { toast } = useToast();

  const saveHomeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/homepage", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật trang chủ" });
    }
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">🎯 Hero Section</TabsTrigger>
          <TabsTrigger value="features">⭐ Đặc điểm nổi bật</TabsTrigger>
          <TabsTrigger value="whychoose">🏆 Tại sao chọn chúng tôi</TabsTrigger>
          <TabsTrigger value="stats">📊 Thống kê</TabsTrigger>
          <TabsTrigger value="cta">📞 Call to Action</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section - Banner chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tiêu đề chính</Label>
                <Input
                  value={homeData.heroTitle}
                  onChange={(e) => setHomeData(prev => ({...prev, heroTitle: e.target.value}))}
                />
              </div>
              <div>
                <Label>Phụ đề</Label>
                <Input
                  value={homeData.heroSubtitle}
                  onChange={(e) => setHomeData(prev => ({...prev, heroSubtitle: e.target.value}))}
                />
              </div>
              <div>
                <Label>Text nút bấm</Label>
                <Input
                  value={homeData.heroButtonText}
                  onChange={(e) => setHomeData(prev => ({...prev, heroButtonText: e.target.value}))}
                />
              </div>
              <div>
                <Label>Ảnh nền Hero</Label>
                <ImageUploader
                  onImageUpload={(url) => setHomeData(prev => ({...prev, heroImage: url}))}
                  currentImage={homeData.heroImage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Đặc điểm nổi bật</span>
                <Button size="sm" onClick={() => {
                  const newFeature = {
                    id: Date.now(),
                    title: "Đặc điểm mới",
                    description: "Mô tả đặc điểm",
                    icon: "✨",
                    image: ""
                  };
                  setHomeData(prev => ({
                    ...prev,
                    features: [...prev.features, newFeature]
                  }));
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm đặc điểm
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homeData.features.map((feature, index) => (
                  <div key={feature.id} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tiêu đề</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...homeData.features];
                            newFeatures[index].title = e.target.value;
                            setHomeData(prev => ({...prev, features: newFeatures}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Icon (emoji)</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => {
                            const newFeatures = [...homeData.features];
                            newFeatures[index].icon = e.target.value;
                            setHomeData(prev => ({...prev, features: newFeatures}));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...homeData.features];
                          newFeatures[index].description = e.target.value;
                          setHomeData(prev => ({...prev, features: newFeatures}));
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="mt-4">
                      <Label>Ảnh minh hoạ</Label>
                      <ImageUploader
                        onImageUpload={(url) => {
                          const newFeatures = [...homeData.features];
                          newFeatures[index].image = url;
                          setHomeData(prev => ({...prev, features: newFeatures}));
                        }}
                        currentImage={feature.image}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => {
                        const newFeatures = homeData.features.filter((_, i) => i !== index);
                        setHomeData(prev => ({...prev, features: newFeatures}));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whychoose" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tại sao chọn chúng tôi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tiêu đề section</Label>
                <Input
                  value={homeData.whyChooseUs.title}
                  onChange={(e) => setHomeData(prev => ({
                    ...prev,
                    whyChooseUs: {...prev.whyChooseUs, title: e.target.value}
                  }))}
                />
              </div>
              <div className="space-y-4">
                {homeData.whyChooseUs.items.map((item, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tiêu đề</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...homeData.whyChooseUs.items];
                            newItems[index].title = e.target.value;
                            setHomeData(prev => ({
                              ...prev,
                              whyChooseUs: {...prev.whyChooseUs, items: newItems}
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          value={item.icon}
                          onChange={(e) => {
                            const newItems = [...homeData.whyChooseUs.items];
                            newItems[index].icon = e.target.value;
                            setHomeData(prev => ({
                              ...prev,
                              whyChooseUs: {...prev.whyChooseUs, items: newItems}
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...homeData.whyChooseUs.items];
                          newItems[index].description = e.target.value;
                          setHomeData(prev => ({
                            ...prev,
                            whyChooseUs: {...prev.whyChooseUs, items: newItems}
                          }));
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const newItem = {
                    title: "Lý do mới",
                    description: "Mô tả lý do",
                    icon: "⭐"
                  };
                  setHomeData(prev => ({
                    ...prev,
                    whyChooseUs: {
                      ...prev.whyChooseUs,
                      items: [...prev.whyChooseUs.items, newItem]
                    }
                  }));
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm lý do
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê trường học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Số học sinh</Label>
                  <Input
                    value={homeData.statistics.students}
                    onChange={(e) => setHomeData(prev => ({
                      ...prev,
                      statistics: {...prev.statistics, students: e.target.value}
                    }))}
                  />
                </div>
                <div>
                  <Label>Số giáo viên</Label>
                  <Input
                    value={homeData.statistics.teachers}
                    onChange={(e) => setHomeData(prev => ({
                      ...prev,
                      statistics: {...prev.statistics, teachers: e.target.value}
                    }))}
                  />
                </div>
                <div>
                  <Label>Năm kinh nghiệm</Label>
                  <Input
                    value={homeData.statistics.years}
                    onChange={(e) => setHomeData(prev => ({
                      ...prev,
                      statistics: {...prev.statistics, years: e.target.value}
                    }))}
                  />
                </div>
                <div>
                  <Label>Giải thưởng</Label>
                  <Input
                    value={homeData.statistics.awards}
                    onChange={(e) => setHomeData(prev => ({
                      ...prev,
                      statistics: {...prev.statistics, awards: e.target.value}
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action - Kêu gọi hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tiêu đề CTA</Label>
                <Input
                  value={homeData.ctaSection.title}
                  onChange={(e) => setHomeData(prev => ({
                    ...prev,
                    ctaSection: {...prev.ctaSection, title: e.target.value}
                  }))}
                />
              </div>
              <div>
                <Label>Phụ đề CTA</Label>
                <Input
                  value={homeData.ctaSection.subtitle}
                  onChange={(e) => setHomeData(prev => ({
                    ...prev,
                    ctaSection: {...prev.ctaSection, subtitle: e.target.value}
                  }))}
                />
              </div>
              <div>
                <Label>Text nút bấm</Label>
                <Input
                  value={homeData.ctaSection.buttonText}
                  onChange={(e) => setHomeData(prev => ({
                    ...prev,
                    ctaSection: {...prev.ctaSection, buttonText: e.target.value}
                  }))}
                />
              </div>
              <div>
                <Label>Ảnh nền CTA</Label>
                <ImageUploader
                  onImageUpload={(url) => setHomeData(prev => ({
                    ...prev,
                    ctaSection: {...prev.ctaSection, backgroundImage: url}
                  }))}
                  currentImage={homeData.ctaSection.backgroundImage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => saveHomeMutation.mutate(homeData)} disabled={saveHomeMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {saveHomeMutation.isPending ? "Đang lưu..." : "Lưu toàn bộ trang chủ"}
        </Button>
      </div>
    </div>
  );
};

// Quản lý trang giới thiệu với đầy đủ thư mục con
const AboutManager = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [aboutData, setAboutData] = useState({
    // Tổng quan trường
    overview: {
      mission: "",
      vision: "",
      coreValues: "",
      history: "",
      principalMessage: "",
      principalImage: "",
      principalName: "Cô Nguyễn Thị Hương",
      principalTitle: "Hiệu trưởng"
    },
    
    // Đội ngũ giáo viên
    teachers: [
      {
        id: 1,
        name: "Cô Nguyễn Thị Lan",
        position: "Giáo viên chủ nhiệm lớp Mầm",
        experience: "5 năm",
        education: "Cử nhân Sư phạm Mầm non",
        specialization: "Phát triển ngôn ngữ",
        image: "",
        description: ""
      }
    ],
    
    // Cơ sở vật chất
    facilities: [
      {
        id: 1,
        name: "Phòng học thông minh",
        description: "Trang bị đầy đủ thiết bị hiện đại",
        images: [],
        area: "50m²",
        capacity: "25 học sinh"
      }
    ],
    
    // Chương trình giáo dục
    educationProgram: {
      philosophy: "",
      methodology: "",
      curriculum: "",
      assessment: "",
      extracurricular: ""
    },
    
    // Thành tích & giải thưởng
    achievements: [
      {
        id: 1,
        title: "Trường mầm non tiêu biểu",
        year: "2023",
        organization: "UBND Quận",
        description: "",
        image: ""
      }
    ],
    
    // Tin tức & sự kiện
    newsEvents: {
      showLatestNews: true,
      maxNewsDisplay: 6,
      featuredEvent: {
        title: "",
        date: "",
        description: "",
        image: ""
      }
    }
  });

  const { toast } = useToast();

  const saveAboutMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/about", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật trang giới thiệu" });
    }
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📋 Tổng quan</TabsTrigger>
          <TabsTrigger value="teachers">👩‍🏫 Giáo viên</TabsTrigger>
          <TabsTrigger value="facilities">🏢 Cơ sở vật chất</TabsTrigger>
          <TabsTrigger value="program">📚 Chương trình</TabsTrigger>
          <TabsTrigger value="achievements">🏆 Thành tích</TabsTrigger>
          <TabsTrigger value="news">📰 Tin tức</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan về trường</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sứ mệnh</Label>
                <Textarea
                  value={aboutData.overview.mission}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    overview: {...prev.overview, mission: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Tầm nhìn</Label>
                <Textarea
                  value={aboutData.overview.vision}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    overview: {...prev.overview, vision: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Giá trị cốt lõi</Label>
                <Textarea
                  value={aboutData.overview.coreValues}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    overview: {...prev.overview, coreValues: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Lịch sử phát triển</Label>
                <Textarea
                  value={aboutData.overview.history}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    overview: {...prev.overview, history: e.target.value}
                  }))}
                  rows={6}
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Thông điệp từ hiệu trưởng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tên hiệu trưởng</Label>
                    <Input
                      value={aboutData.overview.principalName}
                      onChange={(e) => setAboutData(prev => ({
                        ...prev,
                        overview: {...prev.overview, principalName: e.target.value}
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Chức danh</Label>
                    <Input
                      value={aboutData.overview.principalTitle}
                      onChange={(e) => setAboutData(prev => ({
                        ...prev,
                        overview: {...prev.overview, principalTitle: e.target.value}
                      }))}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Ảnh hiệu trưởng</Label>
                  <ImageUploader
                    onImageUpload={(url) => setAboutData(prev => ({
                      ...prev,
                      overview: {...prev.overview, principalImage: url}
                    }))}
                    currentImage={aboutData.overview.principalImage}
                  />
                </div>
                <div className="mt-4">
                  <Label>Thông điệp hiệu trưởng</Label>
                  <Textarea
                    value={aboutData.overview.principalMessage}
                    onChange={(e) => setAboutData(prev => ({
                      ...prev,
                      overview: {...prev.overview, principalMessage: e.target.value}
                    }))}
                    rows={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Đội ngũ giáo viên</span>
                <Button size="sm" onClick={() => {
                  const newTeacher = {
                    id: Date.now(),
                    name: "Cô/Thầy mới",
                    position: "Giáo viên",
                    experience: "1 năm",
                    education: "Cử nhân",
                    specialization: "Chuyên môn",
                    image: "",
                    description: ""
                  };
                  setAboutData(prev => ({
                    ...prev,
                    teachers: [...prev.teachers, newTeacher]
                  }));
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm giáo viên
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aboutData.teachers.map((teacher, index) => (
                  <div key={teacher.id} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Họ tên</Label>
                        <Input
                          value={teacher.name}
                          onChange={(e) => {
                            const newTeachers = [...aboutData.teachers];
                            newTeachers[index].name = e.target.value;
                            setAboutData(prev => ({...prev, teachers: newTeachers}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Vị trí</Label>
                        <Input
                          value={teacher.position}
                          onChange={(e) => {
                            const newTeachers = [...aboutData.teachers];
                            newTeachers[index].position = e.target.value;
                            setAboutData(prev => ({...prev, teachers: newTeachers}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Kinh nghiệm</Label>
                        <Input
                          value={teacher.experience}
                          onChange={(e) => {
                            const newTeachers = [...aboutData.teachers];
                            newTeachers[index].experience = e.target.value;
                            setAboutData(prev => ({...prev, teachers: newTeachers}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Trình độ học vấn</Label>
                        <Input
                          value={teacher.education}
                          onChange={(e) => {
                            const newTeachers = [...aboutData.teachers];
                            newTeachers[index].education = e.target.value;
                            setAboutData(prev => ({...prev, teachers: newTeachers}));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Chuyên môn</Label>
                      <Input
                        value={teacher.specialization}
                        onChange={(e) => {
                          const newTeachers = [...aboutData.teachers];
                          newTeachers[index].specialization = e.target.value;
                          setAboutData(prev => ({...prev, teachers: newTeachers}));
                        }}
                      />
                    </div>
                    <div className="mt-4">
                      <Label>Ảnh giáo viên</Label>
                      <ImageUploader
                        onImageUpload={(url) => {
                          const newTeachers = [...aboutData.teachers];
                          newTeachers[index].image = url;
                          setAboutData(prev => ({...prev, teachers: newTeachers}));
                        }}
                        currentImage={teacher.image}
                      />
                    </div>
                    <div className="mt-4">
                      <Label>Giới thiệu</Label>
                      <Textarea
                        value={teacher.description}
                        onChange={(e) => {
                          const newTeachers = [...aboutData.teachers];
                          newTeachers[index].description = e.target.value;
                          setAboutData(prev => ({...prev, teachers: newTeachers}));
                        }}
                        rows={3}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => {
                        const newTeachers = aboutData.teachers.filter((_, i) => i !== index);
                        setAboutData(prev => ({...prev, teachers: newTeachers}));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa giáo viên
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cơ sở vật chất</span>
                <Button size="sm" onClick={() => {
                  const newFacility = {
                    id: Date.now(),
                    name: "Cơ sở mới",
                    description: "Mô tả cơ sở",
                    images: [],
                    area: "",
                    capacity: ""
                  };
                  setAboutData(prev => ({
                    ...prev,
                    facilities: [...prev.facilities, newFacility]
                  }));
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm cơ sở
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aboutData.facilities.map((facility, index) => (
                  <div key={facility.id} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Tên cơ sở</Label>
                        <Input
                          value={facility.name}
                          onChange={(e) => {
                            const newFacilities = [...aboutData.facilities];
                            newFacilities[index].name = e.target.value;
                            setAboutData(prev => ({...prev, facilities: newFacilities}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Diện tích</Label>
                        <Input
                          value={facility.area}
                          onChange={(e) => {
                            const newFacilities = [...aboutData.facilities];
                            newFacilities[index].area = e.target.value;
                            setAboutData(prev => ({...prev, facilities: newFacilities}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Sức chứa</Label>
                        <Input
                          value={facility.capacity}
                          onChange={(e) => {
                            const newFacilities = [...aboutData.facilities];
                            newFacilities[index].capacity = e.target.value;
                            setAboutData(prev => ({...prev, facilities: newFacilities}));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={facility.description}
                        onChange={(e) => {
                          const newFacilities = [...aboutData.facilities];
                          newFacilities[index].description = e.target.value;
                          setAboutData(prev => ({...prev, facilities: newFacilities}));
                        }}
                        rows={3}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => {
                        const newFacilities = aboutData.facilities.filter((_, i) => i !== index);
                        setAboutData(prev => ({...prev, facilities: newFacilities}));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa cơ sở
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chương trình giáo dục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Triết lý giáo dục</Label>
                <Textarea
                  value={aboutData.educationProgram.philosophy}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    educationProgram: {...prev.educationProgram, philosophy: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Phương pháp giảng dạy</Label>
                <Textarea
                  value={aboutData.educationProgram.methodology}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    educationProgram: {...prev.educationProgram, methodology: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Chương trình học</Label>
                <Textarea
                  value={aboutData.educationProgram.curriculum}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    educationProgram: {...prev.educationProgram, curriculum: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Đánh giá kết quả học tập</Label>
                <Textarea
                  value={aboutData.educationProgram.assessment}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    educationProgram: {...prev.educationProgram, assessment: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
              <div>
                <Label>Hoạt động ngoại khóa</Label>
                <Textarea
                  value={aboutData.educationProgram.extracurricular}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    educationProgram: {...prev.educationProgram, extracurricular: e.target.value}
                  }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Thành tích & Giải thưởng</span>
                <Button size="sm" onClick={() => {
                  const newAchievement = {
                    id: Date.now(),
                    title: "Thành tích mới",
                    year: new Date().getFullYear().toString(),
                    organization: "Tổ chức",
                    description: "",
                    image: ""
                  };
                  setAboutData(prev => ({
                    ...prev,
                    achievements: [...prev.achievements, newAchievement]
                  }));
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thành tích
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aboutData.achievements.map((achievement, index) => (
                  <div key={achievement.id} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Tên giải thưởng</Label>
                        <Input
                          value={achievement.title}
                          onChange={(e) => {
                            const newAchievements = [...aboutData.achievements];
                            newAchievements[index].title = e.target.value;
                            setAboutData(prev => ({...prev, achievements: newAchievements}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Năm đạt giải</Label>
                        <Input
                          value={achievement.year}
                          onChange={(e) => {
                            const newAchievements = [...aboutData.achievements];
                            newAchievements[index].year = e.target.value;
                            setAboutData(prev => ({...prev, achievements: newAchievements}));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Tổ chức trao giải</Label>
                        <Input
                          value={achievement.organization}
                          onChange={(e) => {
                            const newAchievements = [...aboutData.achievements];
                            newAchievements[index].organization = e.target.value;
                            setAboutData(prev => ({...prev, achievements: newAchievements}));
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={achievement.description}
                        onChange={(e) => {
                          const newAchievements = [...aboutData.achievements];
                          newAchievements[index].description = e.target.value;
                          setAboutData(prev => ({...prev, achievements: newAchievements}));
                        }}
                        rows={3}
                      />
                    </div>
                    <div className="mt-4">
                      <Label>Ảnh minh chứng</Label>
                      <ImageUploader
                        onImageUpload={(url) => {
                          const newAchievements = [...aboutData.achievements];
                          newAchievements[index].image = url;
                          setAboutData(prev => ({...prev, achievements: newAchievements}));
                        }}
                        currentImage={achievement.image}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => {
                        const newAchievements = aboutData.achievements.filter((_, i) => i !== index);
                        setAboutData(prev => ({...prev, achievements: newAchievements}));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa thành tích
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt tin tức & sự kiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aboutData.newsEvents.showLatestNews}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    newsEvents: {...prev.newsEvents, showLatestNews: e.target.checked}
                  }))}
                />
                <Label>Hiển thị tin tức mới nhất trên trang giới thiệu</Label>
              </div>
              <div>
                <Label>Số lượng tin tức hiển thị tối đa</Label>
                <Input
                  type="number"
                  value={aboutData.newsEvents.maxNewsDisplay}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    newsEvents: {...prev.newsEvents, maxNewsDisplay: parseInt(e.target.value)}
                  }))}
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Sự kiện nổi bật</h3>
                <div>
                  <Label>Tiêu đề sự kiện</Label>
                  <Input
                    value={aboutData.newsEvents.featuredEvent.title}
                    onChange={(e) => setAboutData(prev => ({
                      ...prev,
                      newsEvents: {
                        ...prev.newsEvents,
                        featuredEvent: {...prev.newsEvents.featuredEvent, title: e.target.value}
                      }
                    }))}
                  />
                </div>
                <div className="mt-4">
                  <Label>Ngày tổ chức</Label>
                  <Input
                    type="date"
                    value={aboutData.newsEvents.featuredEvent.date}
                    onChange={(e) => setAboutData(prev => ({
                      ...prev,
                      newsEvents: {
                        ...prev.newsEvents,
                        featuredEvent: {...prev.newsEvents.featuredEvent, date: e.target.value}
                      }
                    }))}
                  />
                </div>
                <div className="mt-4">
                  <Label>Mô tả sự kiện</Label>
                  <Textarea
                    value={aboutData.newsEvents.featuredEvent.description}
                    onChange={(e) => setAboutData(prev => ({
                      ...prev,
                      newsEvents: {
                        ...prev.newsEvents,
                        featuredEvent: {...prev.newsEvents.featuredEvent, description: e.target.value}
                      }
                    }))}
                    rows={4}
                  />
                </div>
                <div className="mt-4">
                  <Label>Ảnh sự kiện</Label>
                  <ImageUploader
                    onImageUpload={(url) => setAboutData(prev => ({
                      ...prev,
                      newsEvents: {
                        ...prev.newsEvents,
                        featuredEvent: {...prev.newsEvents.featuredEvent, image: url}
                      }
                    }))}
                    currentImage={aboutData.newsEvents.featuredEvent.image}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => saveAboutMutation.mutate(aboutData)} disabled={saveAboutMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {saveAboutMutation.isPending ? "Đang lưu..." : "Lưu toàn bộ trang giới thiệu"}
        </Button>
      </div>
    </div>
  );
};

// Quản lý trang phụ huynh
const ParentsManager = () => {
  const [parentsData, setParentsData] = useState({
    parentGuide: "",
    educationTips: "",
    documents: []
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['/api/parent-documents'],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/parent-documents", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã thêm tài liệu" });
      queryClient.invalidateQueries({ queryKey: ['/api/parent-documents'] });
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin dành cho phụ huynh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Hướng dẫn phụ huynh</Label>
            <Textarea
              value={parentsData.parentGuide}
              onChange={(e) => setParentsData(prev => ({...prev, parentGuide: e.target.value}))}
              rows={6}
            />
          </div>
          <div>
            <Label>Mẹo giáo dục</Label>
            <Textarea
              value={parentsData.educationTips}
              onChange={(e) => setParentsData(prev => ({...prev, educationTips: e.target.value}))}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tài liệu tải về</span>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tài liệu
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(documents as any[]).map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Quản lý trang tuyển sinh
const AdmissionManager = () => {
  const [admissionData, setAdmissionData] = useState({
    generalInfo: "",
    requirements: "",
    procedures: "",
    schedule: "",
    tuitionFees: "",
    documents: ""
  });

  const { toast } = useToast();

  const saveAdmissionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/admission", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật thông tin tuyển sinh" });
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tuyển sinh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Thông tin chung</Label>
            <Textarea
              value={admissionData.generalInfo}
              onChange={(e) => setAdmissionData(prev => ({...prev, generalInfo: e.target.value}))}
              rows={4}
            />
          </div>
          <div>
            <Label>Yêu cầu đầu vào</Label>
            <Textarea
              value={admissionData.requirements}
              onChange={(e) => setAdmissionData(prev => ({...prev, requirements: e.target.value}))}
              rows={4}
            />
          </div>
          <div>
            <Label>Quy trình tuyển sinh</Label>
            <Textarea
              value={admissionData.procedures}
              onChange={(e) => setAdmissionData(prev => ({...prev, procedures: e.target.value}))}
              rows={4}
            />
          </div>
          <div>
            <Label>Lịch tuyển sinh</Label>
            <Textarea
              value={admissionData.schedule}
              onChange={(e) => setAdmissionData(prev => ({...prev, schedule: e.target.value}))}
              rows={3}
            />
          </div>
          <div>
            <Label>Học phí</Label>
            <Textarea
              value={admissionData.tuitionFees}
              onChange={(e) => setAdmissionData(prev => ({...prev, tuitionFees: e.target.value}))}
              rows={3}
            />
          </div>
          <div>
            <Label>Hồ sơ cần thiết</Label>
            <Textarea
              value={admissionData.documents}
              onChange={(e) => setAdmissionData(prev => ({...prev, documents: e.target.value}))}
              rows={4}
            />
          </div>
          <Button onClick={() => saveAdmissionMutation.mutate(admissionData)}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thông tin tuyển sinh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Quản lý liên hệ
const ContactManager = () => {
  const [contactData, setContactData] = useState({
    address: "",
    phone: "",
    email: "",
    workingHours: "",
    googleMapsEmbed: "",
    socialMedia: {
      facebook: "",
      youtube: "",
      instagram: ""
    }
  });

  const { toast } = useToast();

  const saveContactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/contact", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật thông tin liên hệ" });
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={contactData.address}
              onChange={(e) => setContactData(prev => ({...prev, address: e.target.value}))}
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={contactData.phone}
              onChange={(e) => setContactData(prev => ({...prev, phone: e.target.value}))}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={contactData.email}
              onChange={(e) => setContactData(prev => ({...prev, email: e.target.value}))}
            />
          </div>
          <div>
            <Label>Giờ làm việc</Label>
            <Textarea
              value={contactData.workingHours}
              onChange={(e) => setContactData(prev => ({...prev, workingHours: e.target.value}))}
              rows={3}
            />
          </div>
          <div>
            <Label>Google Maps Embed</Label>
            <Textarea
              value={contactData.googleMapsEmbed}
              onChange={(e) => setContactData(prev => ({...prev, googleMapsEmbed: e.target.value}))}
              rows={4}
              placeholder="Nhập mã nhúng Google Maps"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Mạng xã hội</Label>
            <div>
              <Label className="text-sm">Facebook</Label>
              <Input
                value={contactData.socialMedia.facebook}
                onChange={(e) => setContactData(prev => ({
                  ...prev, 
                  socialMedia: {...prev.socialMedia, facebook: e.target.value}
                }))}
              />
            </div>
            <div>
              <Label className="text-sm">YouTube</Label>
              <Input
                value={contactData.socialMedia.youtube}
                onChange={(e) => setContactData(prev => ({
                  ...prev, 
                  socialMedia: {...prev.socialMedia, youtube: e.target.value}
                }))}
              />
            </div>
            <div>
              <Label className="text-sm">Instagram</Label>
              <Input
                value={contactData.socialMedia.instagram}
                onChange={(e) => setContactData(prev => ({
                  ...prev, 
                  socialMedia: {...prev.socialMedia, instagram: e.target.value}
                }))}
              />
            </div>
          </div>

          <Button onClick={() => saveContactMutation.mutate(contactData)}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thông tin liên hệ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Panel chính
export default function FullContentManager() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý toàn bộ nội dung website
          </h1>
          <p className="text-gray-600">
            Quản lý đầy đủ tất cả nội dung trên website mầm non
          </p>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">🏠 Trang chủ</TabsTrigger>
            <TabsTrigger value="about">ℹ️ Giới thiệu</TabsTrigger>
            <TabsTrigger value="programs">📚 Chương trình</TabsTrigger>
            <TabsTrigger value="activities">🎯 Hoạt động</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <HomeManager />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <AboutManager />
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý chương trình học - Liên kết đến dashboard chính</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="mb-4">Chương trình học được quản lý chi tiết trong dashboard chính</p>
                <Button onClick={() => window.open('/admin/dashboard', '_blank')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Mở dashboard chính
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý hoạt động - Liên kết đến dashboard chính</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="mb-4">Hoạt động được quản lý chi tiết trong dashboard chính</p>
                <Button onClick={() => window.open('/admin/dashboard', '_blank')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Mở dashboard chính
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tab thứ 2 cho các trang còn lại */}
        <div className="mt-8">
          <Tabs defaultValue="parents" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="parents">👨‍👩‍👧‍👦 Phụ huynh</TabsTrigger>
              <TabsTrigger value="admission">🎓 Tuyển sinh</TabsTrigger>
              <TabsTrigger value="contact">📞 Liên hệ</TabsTrigger>
              <TabsTrigger value="settings">⚙️ Cài đặt</TabsTrigger>
            </TabsList>

            <TabsContent value="parents" className="mt-6">
              <ParentsManager />
            </TabsContent>

            <TabsContent value="admission" className="mt-6">
              <AdmissionManager />
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <ContactManager />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Chế độ bảo trì</h3>
                        <p className="text-sm text-gray-600">Bật/tắt chế độ bảo trì website</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Cấu hình
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Backup dữ liệu</h3>
                        <p className="text-sm text-gray-600">Sao lưu toàn bộ dữ liệu website</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Backup ngay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}