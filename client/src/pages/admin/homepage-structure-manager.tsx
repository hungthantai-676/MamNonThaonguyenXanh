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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Star,
  Award,
  MessageCircle
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

// Tạo bài viết mới - tương ứng với mục đầu tiên trong ảnh
const CreateNewPostManager = () => {
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
    featured: false,
    status: "draft"
  });

  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/articles", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã tạo bài viết mới" });
      setPostData({ title: "", category: "", content: "", image: "", featured: false, status: "draft" });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Tạo bài viết mới</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tiêu đề bài viết</Label>
          <Input
            value={postData.title}
            onChange={(e) => setPostData(prev => ({...prev, title: e.target.value}))}
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>
        
        <div>
          <Label>Danh mục</Label>
          <Select value={postData.category} onValueChange={(value) => setPostData(prev => ({...prev, category: value}))}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tin-tuc">Tin tức</SelectItem>
              <SelectItem value="thong-bao">Thông báo</SelectItem>
              <SelectItem value="hoat-dong">Hoạt động</SelectItem>
              <SelectItem value="tuyen-sinh">Tuyển sinh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nội dung chính</Label>
          <Textarea
            value={postData.content}
            onChange={(e) => setPostData(prev => ({...prev, content: e.target.value}))}
            rows={6}
            placeholder="Nhập nội dung bài viết"
          />
        </div>

        <div>
          <Label>Ảnh đại diện</Label>
          <ImageUploader
            onImageUpload={(url) => setPostData(prev => ({...prev, image: url}))}
            currentImage={postData.image}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={postData.featured}
            onChange={(e) => setPostData(prev => ({...prev, featured: e.target.checked}))}
            id="featured"
          />
          <Label htmlFor="featured">Bài viết nổi bật</Label>
        </div>

        <div>
          <Label>Trạng thái</Label>
          <Select value={postData.status} onValueChange={(value) => setPostData(prev => ({...prev, status: value}))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="scheduled">Lên lịch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => createPostMutation.mutate(postData)}
          disabled={createPostMutation.isPending}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          {createPostMutation.isPending ? "Đang tạo..." : "Tạo bài viết"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Quản lý tiêu đề và tác giả
const TitleAuthorManager = () => {
  const [titleData, setTitleData] = useState({
    siteTitle: "Mầm Non Thảo Nguyên Xanh",
    siteTagline: "Nơi ươm mầm tương lai cho bé yêu", 
    author: "Ban Giám Hiệu",
    authorBio: "",
    authorImage: ""
  });

  const { toast } = useToast();

  const saveTitleMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/site-info", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật thông tin trang" });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>📰 Tiêu đề và Tác giả</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tiêu đề trang web</Label>
          <Input
            value={titleData.siteTitle}
            onChange={(e) => setTitleData(prev => ({...prev, siteTitle: e.target.value}))}
          />
        </div>

        <div>
          <Label>Slogan trang web</Label>
          <Input
            value={titleData.siteTagline}
            onChange={(e) => setTitleData(prev => ({...prev, siteTagline: e.target.value}))}
          />
        </div>

        <div>
          <Label>Tác giả chính</Label>
          <Input
            value={titleData.author}
            onChange={(e) => setTitleData(prev => ({...prev, author: e.target.value}))}
          />
        </div>

        <div>
          <Label>Giới thiệu tác giả</Label>
          <Textarea
            value={titleData.authorBio}
            onChange={(e) => setTitleData(prev => ({...prev, authorBio: e.target.value}))}
            rows={3}
          />
        </div>

        <div>
          <Label>Ảnh tác giả</Label>
          <ImageUploader
            onImageUpload={(url) => setTitleData(prev => ({...prev, authorImage: url}))}
            currentImage={titleData.authorImage}
          />
        </div>

        <Button 
          onClick={() => saveTitleMutation.mutate(titleData)}
          disabled={saveTitleMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {saveTitleMutation.isPending ? "Đang lưu..." : "Lưu thông tin"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Quản lý nội dung chính của trang chủ
const MainContentManager = () => {
  const [contentData, setContentData] = useState({
    heroSection: {
      title: "",
      subtitle: "",
      backgroundImage: "",
      ctaText: "Tìm hiểu thêm"
    },
    aboutSection: {
      title: "Về chúng tôi",
      content: "",
      image: ""
    },
    servicesSection: {
      title: "Dịch vụ của chúng tôi", 
      services: []
    }
  });

  const { toast } = useToast();

  const saveContentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/main-content", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật nội dung chính" });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>📄 Nội dung chính</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Section */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Banner chính (Hero)</h3>
          <div className="space-y-4">
            <div>
              <Label>Tiêu đề chính</Label>
              <Input
                value={contentData.heroSection.title}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  heroSection: {...prev.heroSection, title: e.target.value}
                }))}
              />
            </div>
            <div>
              <Label>Phụ đề</Label>
              <Input
                value={contentData.heroSection.subtitle}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  heroSection: {...prev.heroSection, subtitle: e.target.value}
                }))}
              />
            </div>
            <div>
              <Label>Text nút bấm</Label>
              <Input
                value={contentData.heroSection.ctaText}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  heroSection: {...prev.heroSection, ctaText: e.target.value}
                }))}
              />
            </div>
            <div>
              <Label>Ảnh nền</Label>
              <ImageUploader
                onImageUpload={(url) => setContentData(prev => ({
                  ...prev,
                  heroSection: {...prev.heroSection, backgroundImage: url}
                }))}
                currentImage={contentData.heroSection.backgroundImage}
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Phần giới thiệu</h3>
          <div className="space-y-4">
            <div>
              <Label>Tiêu đề phần</Label>
              <Input
                value={contentData.aboutSection.title}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  aboutSection: {...prev.aboutSection, title: e.target.value}
                }))}
              />
            </div>
            <div>
              <Label>Nội dung</Label>
              <Textarea
                value={contentData.aboutSection.content}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  aboutSection: {...prev.aboutSection, content: e.target.value}
                }))}
                rows={4}
              />
            </div>
            <div>
              <Label>Ảnh minh hoạ</Label>
              <ImageUploader
                onImageUpload={(url) => setContentData(prev => ({
                  ...prev,
                  aboutSection: {...prev.aboutSection, image: url}
                }))}
                currentImage={contentData.aboutSection.image}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={() => saveContentMutation.mutate(contentData)}
          disabled={saveContentMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {saveContentMutation.isPending ? "Đang lưu..." : "Lưu nội dung chính"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Quản lý liên hệ đính kèm - testimonials, reviews
const AttachedContactManager = () => {
  const [contactData, setContactData] = useState({
    testimonials: [],
    reviews: [],
    contactInfo: {
      showContactForm: true,
      showPhoneNumber: true,
      showEmailAddress: true,
      showAddress: true
    }
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>📞 Liên hệ đính kèm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-4">Testimonials & Reviews</h3>
          <div className="space-y-3">
            {testimonials.map((testimonial: any) => (
              <div key={testimonial.id} className="border p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm mt-2">{testimonial.content}</p>
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
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">Cài đặt hiển thị thông tin liên hệ</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactData.contactInfo.showContactForm}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  contactInfo: {...prev.contactInfo, showContactForm: e.target.checked}
                }))}
                id="showForm"
              />
              <Label htmlFor="showForm">Hiển thị form liên hệ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactData.contactInfo.showPhoneNumber}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  contactInfo: {...prev.contactInfo, showPhoneNumber: e.target.checked}
                }))}
                id="showPhone"
              />
              <Label htmlFor="showPhone">Hiển thị số điện thoại</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactData.contactInfo.showEmailAddress}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  contactInfo: {...prev.contactInfo, showEmailAddress: e.target.checked}
                }))}
                id="showEmail"
              />
              <Label htmlFor="showEmail">Hiển thị email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contactData.contactInfo.showAddress}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  contactInfo: {...prev.contactInfo, showAddress: e.target.checked}
                }))}
                id="showAddress"
              />
              <Label htmlFor="showAddress">Hiển thị địa chỉ</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component chính quản lý cấu trúc trang chủ
export default function HomepageStructureManager() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản trị cấu trúc trang chủ thực tế
          </h1>
          <p className="text-gray-600">
            Quản lý chính xác các mục hiển thị trên trang chủ
          </p>
        </div>

        <Tabs defaultValue="create-post" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create-post">📝 Tạo bài viết</TabsTrigger>
            <TabsTrigger value="title-author">📰 Tiêu đề & Tác giả</TabsTrigger>
            <TabsTrigger value="main-content">📄 Nội dung chính</TabsTrigger>
            <TabsTrigger value="contact-attached">📞 Liên hệ đính kèm</TabsTrigger>
          </TabsList>

          <TabsContent value="create-post" className="mt-6">
            <CreateNewPostManager />
          </TabsContent>

          <TabsContent value="title-author" className="mt-6">
            <TitleAuthorManager />
          </TabsContent>

          <TabsContent value="main-content" className="mt-6">
            <MainContentManager />
          </TabsContent>

          <TabsContent value="contact-attached" className="mt-6">
            <AttachedContactManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}