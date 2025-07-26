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

// Quản lý trang chủ
const HomeManager = () => {
  const [homeData, setHomeData] = useState({
    heroTitle: "Mầm Non Thảo Nguyên Xanh",
    heroSubtitle: "Giáo dục sáng tạo - Ươm mầm tương lai",
    heroImage: "",
    features: [
      {
        title: "Phương pháp giáo dục hiện đại",
        description: "Áp dụng các phương pháp giáo dục tiên tiến"
      }
    ]
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
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
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
            <Label>Ảnh nền Hero</Label>
            <ImageUploader
              onImageUpload={(url) => setHomeData(prev => ({...prev, heroImage: url}))}
              currentImage={homeData.heroImage}
            />
          </div>
          <Button onClick={() => saveHomeMutation.mutate(homeData)}>
            <Save className="w-4 h-4 mr-2" />
            Lưu trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Quản lý trang giới thiệu
const AboutManager = () => {
  const [aboutData, setAboutData] = useState({
    mission: "",
    vision: "",
    history: "",
    principalMessage: "",
    facilities: []
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
      <Card>
        <CardHeader>
          <CardTitle>Thông tin giới thiệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sứ mệnh</Label>
            <Textarea
              value={aboutData.mission}
              onChange={(e) => setAboutData(prev => ({...prev, mission: e.target.value}))}
              rows={4}
            />
          </div>
          <div>
            <Label>Tầm nhìn</Label>
            <Textarea
              value={aboutData.vision}
              onChange={(e) => setAboutData(prev => ({...prev, vision: e.target.value}))}
              rows={4}
            />
          </div>
          <div>
            <Label>Lịch sử phát triển</Label>
            <Textarea
              value={aboutData.history}
              onChange={(e) => setAboutData(prev => ({...prev, history: e.target.value}))}
              rows={6}
            />
          </div>
          <div>
            <Label>Thông điệp hiệu trưởng</Label>
            <Textarea
              value={aboutData.principalMessage}
              onChange={(e) => setAboutData(prev => ({...prev, principalMessage: e.target.value}))}
              rows={4}
            />
          </div>
          <Button onClick={() => saveAboutMutation.mutate(aboutData)}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thông tin giới thiệu
          </Button>
        </CardContent>
      </Card>
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
            {documents.map((doc: any) => (
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home">🏠 Trang chủ</TabsTrigger>
            <TabsTrigger value="about">ℹ️ Giới thiệu</TabsTrigger>
            <TabsTrigger value="programs">📚 Chương trình</TabsTrigger>
            <TabsTrigger value="activities">🎯 Hoạt động</TabsTrigger>
            <TabsTrigger value="parents">👨‍👩‍👧‍👦 Phụ huynh</TabsTrigger>
            <TabsTrigger value="admission">🎓 Tuyển sinh</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <HomeManager />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <AboutManager />
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p>Quản lý chương trình học sẽ được tích hợp tại đây</p>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <div className="text-center py-8">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p>Quản lý hoạt động sẽ được tích hợp tại đây</p>
            </div>
          </TabsContent>

          <TabsContent value="parents" className="mt-6">
            <ParentsManager />
          </TabsContent>

          <TabsContent value="admission" className="mt-6">
            <AdmissionManager />
          </TabsContent>
        </Tabs>

        {/* Tab thứ 2 cho các trang còn lại */}
        <div className="mt-8">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contact">📞 Liên hệ</TabsTrigger>
              <TabsTrigger value="news">📰 Tin tức</TabsTrigger>
              <TabsTrigger value="media">📺 Báo chí</TabsTrigger>
              <TabsTrigger value="settings">⚙️ Cài đặt</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-6">
              <ContactManager />
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <div className="text-center py-8">
                <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Quản lý tin tức đã có trong dashboard chính</p>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <div className="text-center py-8">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Quản lý báo chí đã có trong dashboard chính</p>
              </div>
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