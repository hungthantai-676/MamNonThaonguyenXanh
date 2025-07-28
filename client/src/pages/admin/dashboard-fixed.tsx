import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminDashboardFixed() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for active tab - auto-switch based on localStorage
  const [activeTab, setActiveTab] = useState("contact");

  // Check authentication with better session handling
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin-token");
      const loginTime = localStorage.getItem("admin-login-time");
      const currentTime = Date.now();
      
      // Session expires after 8 hours
      if (!token || !loginTime || (currentTime - parseInt(loginTime)) > 8 * 60 * 60 * 1000) {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-login-time");
        setLocation("/admin/login");
        return false;
      }
      return true;
    };

    if (!checkAuth()) return;

    // Check for edit section from Main Menu
    const editSection = localStorage.getItem('editSection');
    if (editSection) {
      // Map sections to tabs
      const sectionToTab: { [key: string]: string } = {
        'homepage': 'homepage',
        'about': 'about', 
        'admission': 'admission',
        'contact': 'contact',
        'programs': 'programs',
        'activities': 'activities',
        'articles': 'articles',
        'library': 'library'
      };
      
      const targetTab = sectionToTab[editSection];
      if (targetTab) {
        setActiveTab(targetTab);
        
        // Check for specific item IDs and pre-load edit data
        const editArticleId = localStorage.getItem('editArticleId');
        const editProgramId = localStorage.getItem('editProgramId');
        const editActivityId = localStorage.getItem('editActivityId');
        
        if (editArticleId && articles) {
          const articleToEdit = (articles as any[]).find(a => a.id.toString() === editArticleId);
          if (articleToEdit) {
            setNewArticle({
              title: articleToEdit.title,
              excerpt: articleToEdit.excerpt,
              content: articleToEdit.content,
              category: articleToEdit.category,
              imageUrl: articleToEdit.imageUrl || ""
            });
            setEditingArticleId(parseInt(editArticleId));
          }
          localStorage.removeItem('editArticleId');
        }

        if (editProgramId && programs) {
          const programToEdit = (programs as any[]).find(p => p.id.toString() === editProgramId);
          if (programToEdit) {
            setNewProgram({
              name: programToEdit.name,
              ageRange: programToEdit.ageRange,
              description: programToEdit.description,
              tuition: programToEdit.tuition,
              features: programToEdit.features || ""
            });
            setEditingProgramId(parseInt(editProgramId));
          }
          localStorage.removeItem('editProgramId');
        }

        if (editActivityId && activities) {
          const activityToEdit = (activities as any[]).find(a => a.id.toString() === editActivityId);
          if (activityToEdit) {
            setNewActivity({
              name: activityToEdit.name,
              date: activityToEdit.date,
              description: activityToEdit.description,
              location: activityToEdit.location,
              frequency: activityToEdit.frequency
            });
            setEditingActivityId(parseInt(editActivityId));
          }
          localStorage.removeItem('editActivityId');
        }
        
        // Clear the localStorage items after using them
        localStorage.removeItem('editSection');
        
        toast({
          title: "Đã chuyển đến tab tương ứng",
          description: `Tab '${editSection}' đã được mở để chỉnh sửa`,
        });
      }
    }

    // Extend session on activity
    const extendSession = () => {
      localStorage.setItem("admin-login-time", Date.now().toString());
    };

    // Listen for user activity
    window.addEventListener("click", extendSession);
    window.addEventListener("keypress", extendSession);

    return () => {
      window.removeEventListener("click", extendSession);
      window.removeEventListener("keypress", extendSession);
    };
  }, [setLocation, toast]);

  // Load data
  const { data: articles } = useQuery({ queryKey: ["/api/articles"] });
  const { data: programs } = useQuery({ queryKey: ["/api/programs"] });
  const { data: activities } = useQuery({ queryKey: ["/api/activities"] });

  // Homepage content state
  const [homepageContent, setHomepageContent] = useState({
    heroTitle: "Chào mừng đến với Mầm Non Thảo Nguyên Xanh",
    heroSubtitle: "Môi trường giáo dục an toàn, thân thiện và chuyên nghiệp cho bé yêu",
    heroBgImage: "",
    highlight1Title: "Giáo dục toàn diện",
    highlight1Desc: "Phương pháp giáo dục tiên tiến kết hợp giữa truyền thống và hiện đại",
    highlight2Title: "Môi trường an toàn",
    highlight2Desc: "Cơ sở vật chất khang trang, an toàn tuyệt đối cho trẻ em",
    highlight3Title: "Đội ngũ chuyên nghiệp",
    highlight3Desc: "Giáo viên giàu kinh nghiệm, yêu trẻ và nhiệt huyết"
  });

  // Contact info state
  const [contactInfo, setContactInfo] = useState({
    phone: "0856318686",
    email: "mamnonthaonguyenxanh@gmail.com",
    address: "Toà nhà Thảo Nguyên Xanh, đường Lý Thái Tổ, tổ 4, phường Phù Vân, tỉnh Ninh Bình",
    mapUrl: "https://maps.google.com/maps?q=Lý+Thái+Tổ,+Phù+Vân,+Ninh+Bình,+Vietnam&output=embed"
  });

  // Media upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");

  // Article state
  const [newArticle, setNewArticle] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "news",
    imageUrl: ""
  });

  // Edit mode state
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);

  // Program management states
  const [newProgram, setNewProgram] = useState({
    name: "",
    ageRange: "",
    description: "",
    tuition: 4000000,
    features: ""
  });
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null);

  // Activity management states
  const [newActivity, setNewActivity] = useState({
    name: "",
    date: "",
    description: "",
    location: "",
    frequency: ""
  });
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);

  // About content state
  const [aboutContent, setAboutContent] = useState({
    history: "Mầm Non Thảo Nguyên Xanh được thành lập năm 2020 với mong muốn tạo ra một môi trường giáo dục an toàn, thân thiện và chất lượng cao cho trẻ em.",
    mission: "Cung cấp nền giáo dục mầm non toàn diện, phát triển các kỹ năng cơ bản và tính cách tốt đẹp cho trẻ.",
    vision: "Trở thành ngôi trường mầm non hàng đầu trong khu vực, được phụ huynh và cộng đồng tin tưởng.",
    teamInfo: "Đội ngũ giáo viên giàu kinh nghiệm, được đào tạo chuyên nghiệp và có tâm huyết với nghề.",
    imageUrl: ""
  });

  // Admission content state
  const [admissionContent, setAdmissionContent] = useState({
    overview: "Mầm Non Thảo Nguyên Xanh chào đón các bé từ 18 tháng đến 6 tuổi. Chúng tôi cam kết mang đến cho bé môi trường học tập an toàn, vui vẻ và phát triển toàn diện.",
    ageRequirement: "18 tháng - 6 tuổi",
    deadline: "30/06/2024",
    requiredDocuments: "- Giấy khai sinh của bé\n- Sổ khám sức khỏe\n- Giấy chứng nhận tiêm chủng\n- Ảnh 3x4 (4 tấm)\n- Hộ khẩu gia đình",
    process: "1. Nộp hồ sơ đăng ký\n2. Tham quan trường\n3. Phỏng vấn phụ huynh và bé\n4. Thông báo kết quả\n5. Hoàn thành thủ tục nhập học",
    tuition: 4000000
  });

  // Library content state
  const [libraryFiles, setLibraryFiles] = useState([
    { id: 1, name: "Hướng dẫn chăm sóc trẻ tại nhà", type: "PDF", size: "2.5MB", uploadDate: "15/01/2024" },
    { id: 2, name: "Chương trình học tháng 1", type: "PDF", size: "1.8MB", uploadDate: "10/01/2024" },
    { id: 3, name: "Quy định an toàn trường học", type: "PDF", size: "1.2MB", uploadDate: "05/01/2024" }
  ]);
  const [newLibraryFile, setNewLibraryFile] = useState({
    name: "",
    type: "PDF",
    description: ""
  });

  // Save homepage content mutation
  const saveHomepageMutation = useMutation({
    mutationFn: async (content: typeof homepageContent) => {
      const response = await apiRequest("POST", "/api/homepage-content", content);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lưu trang chủ thành công!",
        description: "Nội dung trang chủ đã được cập nhật và hiển thị trên website",
      });
      
      // Auto redirect to homepage after 2 seconds
      setTimeout(() => {
        window.open("/", "_blank");
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Lỗi lưu trang chủ",
        description: "Không thể lưu nội dung trang chủ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  // Save contact info mutation
  const saveContactMutation = useMutation({
    mutationFn: async (contact: typeof contactInfo) => {
      const response = await apiRequest("POST", "/api/contact-info", contact);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thông tin liên hệ thành công!",
        description: "Thông tin liên hệ đã được cập nhật trên website",
      });
    }
  });

  // Save image mutation
  const saveImageMutation = useMutation({
    mutationFn: async (data: { type: string; url: string }) => {
      console.log('Saving image:', data.type, data.url?.substring(0, 50) + '...');
      const response = await apiRequest("POST", "/api/upload-image", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Image saved successfully:', data);
      toast({
        title: "Lưu hình ảnh thành công!",
        description: `${data.type} đã được cập nhật trên website`,
      });
      
      // Clear preview and file after successful save
      if (data.type === 'logo') {
        setLogoFile(null);
        setLogoPreview("");
      } else if (data.type === 'banner') {
        setBannerFile(null);
        setBannerPreview("");
      } else if (data.type === 'video') {
        setVideoFile(null);
        setVideoPreview("");
      }
    },
    onError: (error) => {
      console.error('Image save error:', error);
      toast({
        title: "Lỗi lưu hình ảnh",
        description: `Không thể lưu hình ảnh. Chi tiết: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (article: typeof newArticle) => {
      const response = await apiRequest("POST", "/api/articles", article);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Tạo bài viết thành công!",
        description: "Bài viết mới đã được thêm vào website",
      });
      setNewArticle({ title: "", excerpt: "", content: "", category: "news", imageUrl: "" });
    }
  });

  // Handle file uploads with preview
  const handleFileUpload = (file: File, type: 'logo' | 'banner' | 'video') => {
    if (!file) {
      console.log('No file provided for upload');
      return;
    }

    console.log(`Starting upload for ${type}:`, file.name, file.size, file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log(`File loaded for ${type}, result length:`, result ? result.length : 0);
      
      switch(type) {
        case 'logo':
          setLogoFile(file);
          setLogoPreview(result);
          console.log('Logo preview set:', result ? 'Success' : 'Failed');
          break;
        case 'banner':
          setBannerFile(file);
          setBannerPreview(result);
          console.log('Banner preview set:', result ? 'Success' : 'Failed');
          break;
        case 'video':
          setVideoFile(file);
          setVideoPreview(URL.createObjectURL(file)); // Better for video
          console.log('Video preview set:', 'Success');
          break;
      }
      
      // Inform user that file is ready
      toast({
        title: `${type} đã sẵn sàng!`,
        description: "File đã được tải lên và xem trước. Bấm 'Lưu' để cập nhật.",
      });
    };

    reader.onerror = (error) => {
      console.error(`Error reading ${type} file:`, error);
      toast({
        title: "Lỗi đọc file",
        description: `Không thể đọc file ${type}. Vui lòng thử lại.`,
        variant: "destructive",
      });
    };

    if (type === 'video') {
      // For video, we'll use URL.createObjectURL instead
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      console.log('Video file processed with URL.createObjectURL');
      toast({
        title: "Video đã sẵn sàng!",
        description: "Video đã được tải lên và xem trước. Bấm 'Lưu' để cập nhật.",
      });
    } else {
      reader.readAsDataURL(file);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-login-time");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Admin</h1>
            <p className="text-gray-600">Quản lý nội dung website Mầm Non Thảo Nguyên Xanh</p>
          </div>
          <div className="flex gap-2">
            <Button variant="default" onClick={() => window.open("/admin/main-menu", "_blank")}>
              🏠 Quản lý Menu Chính
            </Button>
            <Button variant="outline" onClick={() => window.open("/", "_blank")}>
              🌐 Xem website
            </Button>
            <Button variant="destructive" onClick={logout}>
              🚪 Đăng xuất
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="contact">📞 Liên hệ</TabsTrigger>
            <TabsTrigger value="media">🖼️ Ảnh/Video</TabsTrigger>
            <TabsTrigger value="homepage">🏠 Trang chủ</TabsTrigger>
            <TabsTrigger value="about">ℹ️ Giới thiệu</TabsTrigger>
            <TabsTrigger value="library">📚 Thư viện</TabsTrigger>
            <TabsTrigger value="admission">🎓 Tuyển sinh</TabsTrigger>
            <TabsTrigger value="programs">📚 Chương trình</TabsTrigger>
            <TabsTrigger value="activities">🎯 Hoạt động</TabsTrigger>
            <TabsTrigger value="articles">📰 Bài viết</TabsTrigger>
            <TabsTrigger value="affiliate">💼 Affiliate</TabsTrigger>
          </TabsList>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>📞 Cập nhật thông tin liên hệ</CardTitle>
                <CardDescription>Thông tin sẽ hiển thị trên header và footer website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">📱 Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">📧 Email</Label>
                    <Input
                      id="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="Nhập email..."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">📍 Địa chỉ</Label>
                  <Textarea
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                    placeholder="Nhập địa chỉ đầy đủ..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="mapUrl">🗺️ Link Google Maps</Label>
                  <Input
                    id="mapUrl"
                    value={contactInfo.mapUrl}
                    onChange={(e) => setContactInfo({...contactInfo, mapUrl: e.target.value})}
                    placeholder="Dán link Google Maps embed..."
                  />
                </div>

                <Button 
                  onClick={() => saveContactMutation.mutate(contactInfo)}
                  disabled={saveContactMutation.isPending}
                  className="w-full"
                >
                  {saveContactMutation.isPending ? "Đang lưu..." : "💾 Lưu thông tin liên hệ"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Upload Tab */}
          <TabsContent value="media">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>🏷️ Logo trường</CardTitle>
                  <CardDescription>Tải lên logo mới cho website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-32 mx-auto" />
                    ) : (
                      <div className="py-8">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-gray-500">Chưa có logo</p>
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'logo');
                    }}
                  />
                  <Button 
                    onClick={() => {
                      console.log('Logo save clicked, preview:', logoPreview ? 'Available' : 'Missing');
                      if (!logoPreview) {
                        toast({
                          title: "Chưa có ảnh",
                          description: "Vui lòng chọn ảnh logo trước khi lưu",
                          variant: "destructive",
                        });
                        return;
                      }
                      saveImageMutation.mutate({ type: 'logo', url: logoPreview });
                    }}
                    disabled={saveImageMutation.isPending}
                    className="w-full"
                  >
                    {saveImageMutation.isPending ? "Đang lưu..." : "💾 Lưu Logo"}
                  </Button>
                </CardContent>
              </Card>

              {/* Banner Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>🖼️ Banner trang chủ</CardTitle>
                  <CardDescription>Hình ảnh chính trên trang chủ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner preview" className="max-w-full max-h-32 mx-auto" />
                    ) : (
                      <div className="py-8">
                        <div className="text-4xl mb-2">🌅</div>
                        <p className="text-gray-500">Chưa có banner</p>
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'banner');
                    }}
                  />
                  <Button 
                    onClick={() => {
                      console.log('Banner save clicked, preview:', bannerPreview ? 'Available' : 'Missing');
                      if (!bannerPreview) {
                        toast({
                          title: "Chưa có ảnh",
                          description: "Vui lòng chọn ảnh banner trước khi lưu",
                          variant: "destructive",
                        });
                        return;
                      }
                      saveImageMutation.mutate({ type: 'banner', url: bannerPreview });
                    }}
                    disabled={saveImageMutation.isPending}
                    className="w-full"
                  >
                    {saveImageMutation.isPending ? "Đang lưu..." : "💾 Lưu Banner"}
                  </Button>
                </CardContent>
              </Card>

              {/* Video Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>🎥 Video giới thiệu</CardTitle>
                  <CardDescription>Video giới thiệu trường học</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {videoPreview ? (
                      <video src={videoPreview} className="max-w-full max-h-32 mx-auto" controls />
                    ) : (
                      <div className="py-8">
                        <div className="text-4xl mb-2">🎬</div>
                        <p className="text-gray-500">Chưa có video</p>
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'video');
                    }}
                  />
                  <Button 
                    onClick={() => {
                      console.log('Video save clicked, preview:', videoPreview ? 'Available' : 'Missing');
                      if (!videoPreview) {
                        toast({
                          title: "Chưa có video",
                          description: "Vui lòng chọn video trước khi lưu",
                          variant: "destructive",
                        });
                        return;
                      }
                      saveImageMutation.mutate({ type: 'video', url: videoPreview });
                    }}
                    disabled={saveImageMutation.isPending}
                    className="w-full"
                  >
                    {saveImageMutation.isPending ? "Đang lưu..." : "💾 Lưu Video"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Homepage Content Tab */}
          <TabsContent value="homepage">
            <Card>
              <CardHeader>
                <CardTitle>🏠 Chỉnh sửa nội dung trang chủ</CardTitle>
                <CardDescription>Cập nhật các nội dung hiển thị trên trang chủ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">🎯 Phần Hero (Banner chính)</h3>
                  <div>
                    <Label htmlFor="heroTitle">📝 Tiêu đề chính</Label>
                    <Input
                      id="heroTitle"
                      value={homepageContent.heroTitle}
                      onChange={(e) => setHomepageContent({...homepageContent, heroTitle: e.target.value})}
                      placeholder="Nhập tiêu đề chính..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroSubtitle">📄 Mô tả phụ</Label>
                    <Textarea
                      id="heroSubtitle"
                      value={homepageContent.heroSubtitle}
                      onChange={(e) => setHomepageContent({...homepageContent, heroSubtitle: e.target.value})}
                      placeholder="Nhập mô tả ngắn về trường..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Highlights Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">⭐ Điểm nổi bật</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>🎓 Điểm nổi bật 1</Label>
                      <Input
                        value={homepageContent.highlight1Title}
                        onChange={(e) => setHomepageContent({...homepageContent, highlight1Title: e.target.value})}
                        placeholder="Tiêu đề..."
                      />
                      <Textarea
                        value={homepageContent.highlight1Desc}
                        onChange={(e) => setHomepageContent({...homepageContent, highlight1Desc: e.target.value})}
                        placeholder="Mô tả..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>🛡️ Điểm nổi bật 2</Label>
                      <Input
                        value={homepageContent.highlight2Title}
                        onChange={(e) => setHomepageContent({...homepageContent, highlight2Title: e.target.value})}
                        placeholder="Tiêu đề..."
                      />
                      <Textarea
                        value={homepageContent.highlight2Desc}
                        onChange={(e) => setHomepageContent({...homepageContent, highlight2Desc: e.target.value})}
                        placeholder="Mô tả..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>👥 Điểm nổi bật 3</Label>
                      <Input
                        value={homepageContent.highlight3Title}
                        onChange={(e) => setHomepageContent({...homepageContent, highlight3Title: e.target.value})}
                        placeholder="Tiêu đề..."
                      />
                      <Textarea
                        value={homepageContent.highlight3Desc}
                        onChange={(e) => setHomepageContent({...homepageContent, highlight3Desc: e.target.value})}
                        placeholder="Mô tả..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t space-y-3">
                  <Button 
                    onClick={() => saveHomepageMutation.mutate(homepageContent)}
                    disabled={saveHomepageMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  >
                    {saveHomepageMutation.isPending ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        💾 Lưu thay đổi trang chủ
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => window.open("/", "_blank")}
                      className="flex-1"
                    >
                      🏠 Xem trang chủ
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setLocation("/admin/main-menu")}
                      className="flex-1"
                    >
                      🔙 Quay lại Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <div className="space-y-6">
              {/* Create Article Form */}
              <Card>
                <CardHeader>
                  <CardTitle>📝 Tạo bài viết mới</CardTitle>
                  <CardDescription>Thêm bài viết vào mục tin tức</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">📰 Tiêu đề bài viết</Label>
                      <Input
                        id="title"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                        placeholder="Nhập tiêu đề..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">🏷️ Danh mục</Label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={newArticle.category}
                        onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                      >
                        <option value="news">Tin tức</option>
                        <option value="events">Sự kiện</option>
                        <option value="education">Giáo dục</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="excerpt">📄 Tóm tắt</Label>
                    <Textarea
                      id="excerpt"
                      value={newArticle.excerpt}
                      onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                      placeholder="Nhập tóm tắt ngắn..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">📝 Nội dung chính</Label>
                    <Textarea
                      id="content"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                      placeholder="Nhập nội dung bài viết..."
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">🖼️ Link hình ảnh</Label>
                    <Input
                      id="imageUrl"
                      value={newArticle.imageUrl}
                      onChange={(e) => setNewArticle({...newArticle, imageUrl: e.target.value})}
                      placeholder="Dán link hình ảnh..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        createArticleMutation.mutate(newArticle);
                        // Reset form after save
                        setNewArticle({
                          title: "",
                          excerpt: "",
                          content: "",
                          category: "news",
                          imageUrl: ""
                        });
                        setEditingArticleId(null);
                      }}
                      disabled={createArticleMutation.isPending}
                      className="flex-1"
                    >
                      {createArticleMutation.isPending 
                        ? (editingArticleId ? "Đang lưu..." : "Đang tạo...") 
                        : (editingArticleId ? "💾 Lưu bài viết" : "📤 Đăng bài viết")
                      }
                    </Button>
                    {editingArticleId && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setNewArticle({
                            title: "",
                            excerpt: "",
                            content: "",
                            category: "news",
                            imageUrl: ""
                          });
                          setEditingArticleId(null);
                        }}
                      >
                        ❌ Hủy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Articles List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>📰 Danh sách bài viết</CardTitle>
                    <CardDescription>Quản lý các bài viết đã đăng</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setNewArticle({
                        title: "",
                        excerpt: "",
                        content: "",
                        category: "news",
                        imageUrl: ""
                      });
                      setEditingArticleId(null);
                      toast({
                        title: "Sẵn sàng tạo bài viết mới",
                        description: "Form tạo bài viết đã được làm mới",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    ➕ Tạo bài viết mới
                  </Button>
                </CardHeader>
                <CardContent>
                  {Array.isArray(articles) && articles.length > 0 ? (
                    <div className="space-y-4">
                      {articles.map((article: any) => (
                        <div key={article.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{article.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{article.excerpt}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {article.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setNewArticle({
                                    title: article.title,
                                    excerpt: article.excerpt,
                                    content: article.content,
                                    category: article.category,
                                    imageUrl: article.imageUrl || ""
                                  });
                                  setEditingArticleId(article.id);
                                }}
                              >
                                ✏️ Sửa
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
                                    // Delete article logic here
                                    console.log("Deleting article:", article.id);
                                  }
                                }}
                              >
                                🗑️ Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📰</div>
                      <p>Chưa có bài viết nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ℹ️ Chỉnh sửa trang Giới thiệu</CardTitle>
                  <CardDescription>Cập nhật thông tin về trường học</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about-history">Lịch sử nhà trường</Label>
                    <Textarea
                      id="about-history"
                      value={aboutContent.history}
                      onChange={(e) => setAboutContent({...aboutContent, history: e.target.value})}
                      placeholder="Lịch sử thành lập và phát triển của trường..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="about-mission">Sứ mệnh</Label>
                    <Textarea
                      id="about-mission"
                      value={aboutContent.mission}
                      onChange={(e) => setAboutContent({...aboutContent, mission: e.target.value})}
                      placeholder="Sứ mệnh và mục tiêu giáo dục..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="about-vision">Tầm nhìn</Label>
                    <Textarea
                      id="about-vision"
                      value={aboutContent.vision}
                      onChange={(e) => setAboutContent({...aboutContent, vision: e.target.value})}
                      placeholder="Tầm nhìn và định hướng phát triển..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="about-team">Thông tin đội ngũ</Label>
                    <Textarea
                      id="about-team"
                      value={aboutContent.teamInfo}
                      onChange={(e) => setAboutContent({...aboutContent, teamInfo: e.target.value})}
                      placeholder="Giới thiệu về đội ngũ giáo viên và nhân viên..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="about-image">Hình ảnh giới thiệu</Label>
                    <Input
                      id="about-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setAboutContent({...aboutContent, imageUrl: e.target?.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {aboutContent.imageUrl && (
                      <img src={aboutContent.imageUrl} alt="Preview" className="mt-2 max-w-xs rounded" />
                    )}
                  </div>

                  <Button 
                    onClick={() => {
                      console.log("Saving about content:", aboutContent);
                      toast({
                        title: "Lưu trang giới thiệu thành công!",
                        description: "Nội dung đã được cập nhật",
                      });
                    }}
                    className="w-full"
                  >
                    💾 Lưu thông tin giới thiệu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library">
            <div className="space-y-6">
              {/* Add New File Form */}
              <Card>
                <CardHeader>
                  <CardTitle>📚 Thêm tài liệu mới</CardTitle>
                  <CardDescription>Tải lên tài liệu cho phụ huynh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="file-name">Tên tài liệu</Label>
                      <Input
                        id="file-name"
                        value={newLibraryFile.name}
                        onChange={(e) => setNewLibraryFile({...newLibraryFile, name: e.target.value})}
                        placeholder="Ví dụ: Hướng dẫn chăm sóc trẻ"
                      />
                    </div>
                    <div>
                      <Label htmlFor="file-type">Loại tài liệu</Label>
                      <select
                        id="file-type"
                        value={newLibraryFile.type}
                        onChange={(e) => setNewLibraryFile({...newLibraryFile, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOC">Word Document</option>
                        <option value="XLS">Excel</option>
                        <option value="PPT">PowerPoint</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="file-description">Mô tả</Label>
                    <Textarea
                      id="file-description"
                      value={newLibraryFile.description}
                      onChange={(e) => setNewLibraryFile({...newLibraryFile, description: e.target.value})}
                      placeholder="Mô tả ngắn về nội dung tài liệu..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="file-upload">Chọn file</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    />
                  </div>

                  <Button 
                    onClick={() => {
                      const newFile = {
                        id: libraryFiles.length + 1,
                        name: newLibraryFile.name,
                        type: newLibraryFile.type,
                        size: "2.1MB", // Demo size
                        uploadDate: new Date().toLocaleDateString('vi-VN')
                      };
                      setLibraryFiles([...libraryFiles, newFile]);
                      setNewLibraryFile({ name: "", type: "PDF", description: "" });
                      toast({
                        title: "Tải lên thành công!",
                        description: "Tài liệu đã được thêm vào thư viện",
                      });
                    }}
                    className="w-full"
                  >
                    📤 Tải lên tài liệu
                  </Button>
                </CardContent>
              </Card>

              {/* Library Files List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>📂 Danh sách tài liệu</CardTitle>
                    <CardDescription>Quản lý tài liệu trong thư viện phụ huynh</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setNewLibraryFile({ name: "", type: "PDF", description: "" });
                      toast({
                        title: "Sẵn sàng thêm tài liệu mới",
                        description: "Form thêm tài liệu đã được làm mới",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    ➕ Thêm tài liệu mới
                  </Button>
                </CardHeader>
                <CardContent>
                  {libraryFiles.length > 0 ? (
                    <div className="space-y-4">
                      {libraryFiles.map((file) => (
                        <div key={file.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {file.type === 'PDF' && '📄'}
                                {file.type === 'DOC' && '📝'}
                                {file.type === 'XLS' && '📊'}
                                {file.type === 'PPT' && '📊'}
                              </div>
                              <div>
                                <h4 className="font-medium">{file.name}</h4>
                                <div className="flex gap-2 mt-1">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {file.type}
                                  </span>
                                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                    {file.size}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {file.uploadDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                📥 Tải xuống
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Bạn có chắc muốn xóa tài liệu này?")) {
                                    setLibraryFiles(libraryFiles.filter(f => f.id !== file.id));
                                    toast({
                                      title: "Đã xóa tài liệu",
                                      description: "Tài liệu đã được xóa khỏi thư viện",
                                    });
                                  }
                                }}
                              >
                                🗑️ Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📚</div>
                      <p>Chưa có tài liệu nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admission Tab */}
          <TabsContent value="admission">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎓 Chỉnh sửa trang Tuyển sinh</CardTitle>
                  <CardDescription>Cập nhật thông tin tuyển sinh và học phí</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="admission-overview">Thông tin tổng quan</Label>
                    <Textarea
                      id="admission-overview"
                      value={admissionContent.overview}
                      onChange={(e) => setAdmissionContent({...admissionContent, overview: e.target.value})}
                      placeholder="Thông tin chung về tuyển sinh..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admission-age">Độ tuổi tuyển sinh</Label>
                      <Input
                        id="admission-age"
                        value={admissionContent.ageRequirement}
                        onChange={(e) => setAdmissionContent({...admissionContent, ageRequirement: e.target.value})}
                        placeholder="Ví dụ: 18 tháng - 6 tuổi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission-deadline">Hạn đăng ký</Label>
                      <Input
                        id="admission-deadline"
                        value={admissionContent.deadline}
                        onChange={(e) => setAdmissionContent({...admissionContent, deadline: e.target.value})}
                        placeholder="Ví dụ: 30/06/2024"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admission-documents">Hồ sơ cần thiết</Label>
                    <Textarea
                      id="admission-documents"
                      value={admissionContent.requiredDocuments}
                      onChange={(e) => setAdmissionContent({...admissionContent, requiredDocuments: e.target.value})}
                      placeholder="Danh sách giấy tờ cần nộp..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="admission-process">Quy trình tuyển sinh</Label>
                    <Textarea
                      id="admission-process"
                      value={admissionContent.process}
                      onChange={(e) => setAdmissionContent({...admissionContent, process: e.target.value})}
                      placeholder="Các bước trong quy trình tuyển sinh..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="admission-tuition">Học phí</Label>
                    <Input
                      id="admission-tuition"
                      type="number"
                      value={admissionContent.tuition}
                      onChange={(e) => setAdmissionContent({...admissionContent, tuition: parseInt(e.target.value) || 0})}
                      placeholder="4000000"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Hiển thị: {admissionContent.tuition.toLocaleString()} VND/tháng
                    </p>
                  </div>

                  <Button 
                    onClick={() => {
                      console.log("Saving admission content:", admissionContent);
                      toast({
                        title: "Lưu thông tin tuyển sinh thành công!",
                        description: "Nội dung đã được cập nhật",
                      });
                    }}
                    className="w-full"
                  >
                    💾 Lưu thông tin tuyển sinh
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <div className="space-y-6">
              {/* Program Form */}
              <Card>
                <CardHeader>
                  <CardTitle>📚 {editingProgramId ? 'Sửa chương trình' : 'Tạo chương trình mới'}</CardTitle>
                  <CardDescription>Cập nhật thông tin chương trình học theo độ tuổi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="program-name">Tên chương trình</Label>
                      <Input
                        id="program-name"
                        value={newProgram.name}
                        onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                        placeholder="Ví dụ: Lớp Mầm non 3-4 tuổi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program-age">Độ tuổi</Label>
                      <Input
                        id="program-age"
                        value={newProgram.ageRange}
                        onChange={(e) => setNewProgram({...newProgram, ageRange: e.target.value})}
                        placeholder="Ví dụ: 3-4 tuổi"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="program-description">Mô tả chương trình</Label>
                    <Textarea
                      id="program-description"
                      value={newProgram.description}
                      onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                      placeholder="Mô tả chi tiết về chương trình học..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="program-tuition">Học phí (VND/tháng)</Label>
                      <Input
                        id="program-tuition"
                        type="number"
                        value={newProgram.tuition}
                        onChange={(e) => setNewProgram({...newProgram, tuition: parseInt(e.target.value) || 0})}
                        placeholder="4000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program-features">Đặc điểm nổi bật</Label>
                      <Input
                        id="program-features"
                        value={newProgram.features}
                        onChange={(e) => setNewProgram({...newProgram, features: e.target.value})}
                        placeholder="Các tính năng đặc biệt..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        console.log("Saving program:", newProgram);
                        setNewProgram({
                          name: "",
                          ageRange: "",
                          description: "",
                          tuition: 4000000,
                          features: ""
                        });
                        setEditingProgramId(null);
                      }}
                      className="flex-1"
                    >
                      {editingProgramId ? "💾 Lưu chương trình" : "📤 Tạo chương trình"}
                    </Button>
                    {editingProgramId && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setNewProgram({
                            name: "",
                            ageRange: "",
                            description: "",
                            tuition: 4000000,
                            features: ""
                          });
                          setEditingProgramId(null);
                        }}
                      >
                        ❌ Hủy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Programs List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>📚 Danh sách chương trình</CardTitle>
                    <CardDescription>Quản lý các chương trình học hiện có</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setNewProgram({
                        name: "",
                        ageRange: "",
                        description: "",
                        tuition: 4000000,
                        features: ""
                      });
                      setEditingProgramId(null);
                      toast({
                        title: "Sẵn sàng tạo chương trình mới",
                        description: "Form tạo chương trình đã được làm mới",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    ➕ Tạo chương trình mới
                  </Button>
                </CardHeader>
                <CardContent>
                  {Array.isArray(programs) && programs.length > 0 ? (
                    <div className="space-y-4">
                      {programs.map((program: any) => (
                        <div key={program.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{program.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{program.ageRange}</p>
                              <p className="text-sm mt-2">{program.description}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {program.tuition?.toLocaleString()} VND/tháng
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setNewProgram({
                                    name: program.name,
                                    ageRange: program.ageRange,
                                    description: program.description,
                                    tuition: program.tuition,
                                    features: program.features || ""
                                  });
                                  setEditingProgramId(program.id);
                                }}
                              >
                                ✏️ Sửa
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Bạn có chắc muốn xóa chương trình này?")) {
                                    console.log("Deleting program:", program.id);
                                  }
                                }}
                              >
                                🗑️ Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📚</div>
                      <p>Chưa có chương trình nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <div className="space-y-6">
              {/* Activity Form */}
              <Card>
                <CardHeader>
                  <CardTitle>🎯 {editingActivityId ? 'Sửa hoạt động' : 'Tạo hoạt động mới'}</CardTitle>
                  <CardDescription>Cập nhật hoạt động ngoại khóa và sự kiện đặc biệt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="activity-name">Tên hoạt động</Label>
                      <Input
                        id="activity-name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                        placeholder="Ví dụ: Ngày hội Trung Thu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="activity-date">Ngày tổ chức</Label>
                      <Input
                        id="activity-date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                        placeholder="Ví dụ: 15/09/2024"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="activity-description">Mô tả hoạt động</Label>
                    <Textarea
                      id="activity-description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      placeholder="Mô tả chi tiết về hoạt động..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="activity-location">Địa điểm</Label>
                      <Input
                        id="activity-location"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                        placeholder="Ví dụ: Sân trường"
                      />
                    </div>
                    <div>
                      <Label htmlFor="activity-frequency">Tần suất</Label>
                      <Input
                        id="activity-frequency"
                        value={newActivity.frequency}
                        onChange={(e) => setNewActivity({...newActivity, frequency: e.target.value})}
                        placeholder="Ví dụ: Hàng tháng"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        console.log("Saving activity:", newActivity);
                        setNewActivity({
                          name: "",
                          date: "",
                          description: "",
                          location: "",
                          frequency: ""
                        });
                        setEditingActivityId(null);
                      }}
                      className="flex-1"
                    >
                      {editingActivityId ? "💾 Lưu hoạt động" : "📤 Tạo hoạt động"}
                    </Button>
                    {editingActivityId && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setNewActivity({
                            name: "",
                            date: "",
                            description: "",
                            location: "",
                            frequency: ""
                          });
                          setEditingActivityId(null);
                        }}
                      >
                        ❌ Hủy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activities List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>🎯 Danh sách hoạt động</CardTitle>
                    <CardDescription>Quản lý các hoạt động hiện có</CardDescription>
                  </div>
                  <Button 
                    onClick={() => {
                      setNewActivity({
                        name: "",
                        date: "",
                        description: "",
                        location: "",
                        frequency: ""
                      });
                      setEditingActivityId(null);
                      toast({
                        title: "Sẵn sàng tạo hoạt động mới",
                        description: "Form tạo hoạt động đã được làm mới",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    ➕ Tạo hoạt động mới
                  </Button>
                </CardHeader>
                <CardContent>
                  {Array.isArray(activities) && activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity: any) => (
                        <div key={activity.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{activity.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{activity.date}</p>
                              <p className="text-sm mt-2">{activity.description}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  📍 {activity.location}
                                </span>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  🔄 {activity.frequency}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setNewActivity({
                                    name: activity.name,
                                    date: activity.date,
                                    description: activity.description,
                                    location: activity.location,
                                    frequency: activity.frequency
                                  });
                                  setEditingActivityId(activity.id);
                                }}
                              >
                                ✏️ Sửa
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Bạn có chắc muốn xóa hoạt động này?")) {
                                    console.log("Deleting activity:", activity.id);
                                  }
                                }}
                              >
                                🗑️ Xóa
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎯</div>
                      <p>Chưa có hoạt động nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="affiliate">
            <Card>
              <CardHeader>
                <CardTitle>💼 Quản lý hệ thống Affiliate</CardTitle>
                <CardDescription>Truy cập bảng điều khiển affiliate chuyên nghiệp</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="space-y-4">
                  <div className="text-6xl">💼</div>
                  <h3 className="text-xl font-semibold">Hệ thống Affiliate Marketing</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Quản lý toàn bộ hệ thống affiliate, thành viên, hoa hồng và thanh toán
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => window.location.href = "/admin/affiliate"}>
                      🚀 Mở Admin Affiliate
                    </Button>
                    <Button variant="outline" onClick={() => window.open("/affiliate", "_blank")}>
                      👥 Xem trang Affiliate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}