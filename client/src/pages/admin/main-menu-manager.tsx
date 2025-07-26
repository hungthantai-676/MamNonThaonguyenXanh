import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { 
  Home, 
  Info, 
  BookOpen, 
  Activity, 
  Users, 
  UserPlus, 
  Newspaper, 
  Phone,
  Save,
  Edit,
  Trash2,
  Plus,
  Upload,
  Settings,
  X
} from "lucide-react";

// Component để upload ảnh trực tiếp từ thiết bị
const SimpleImageUploader = ({ onImageUpload, currentImage }: { onImageUpload: (url: string) => void, currentImage?: string }) => {
  const [imageUrl, setImageUrl] = useState(currentImage || "");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Dán link hình ảnh..."
          className="flex-1"
        />
        <Button onClick={() => onImageUpload(imageUrl)} size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Áp dụng
        </Button>
      </div>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="w-full h-32 object-cover rounded border"
          onError={() => setImageUrl("")}
        />
      )}
    </div>
  );
};

// 1. TRANG CHỦ - Quản lý nội dung trang chủ
const HomepageManager = () => {
  const [homeData, setHomeData] = useState({
    heroTitle: "Mầm Non Thảo Nguyên Xanh",
    heroSubtitle: "Nơi ươm mầm tương lai cho bé yêu",
    heroImage: "",
    features: [],
    statistics: {
      students: "500+",
      teachers: "50+", 
      years: "15+",
      awards: "20+"
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Home className="w-5 h-5 mr-2" />
          🏠 Quản lý Trang Chủ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tiêu đề chính trang chủ</Label>
          <Input
            value={homeData.heroTitle}
            onChange={(e) => setHomeData(prev => ({...prev, heroTitle: e.target.value}))}
          />
        </div>
        <div>
          <Label>Phụ đề trang chủ</Label>
          <Input
            value={homeData.heroSubtitle}
            onChange={(e) => setHomeData(prev => ({...prev, heroSubtitle: e.target.value}))}
          />
        </div>
        <div>
          <Label>Ảnh nền trang chủ</Label>
          <ImageUploader
            onImageUpload={(url) => setHomeData(prev => ({...prev, heroImage: url}))}
            currentImage={homeData.heroImage}
          />
        </div>
        
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

        <Button onClick={() => saveHomeMutation.mutate(homeData)}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Trang Chủ
        </Button>
      </CardContent>
    </Card>
  );
};

// 2. GIỚI THIỆU - Quản lý trang giới thiệu
const AboutManager = () => {
  const [aboutData, setAboutData] = useState({
    mission: "",
    vision: "",
    history: "",
    principalMessage: "",
    principalImage: "",
    principalName: "Cô Nguyễn Thị Hương"
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="w-5 h-5 mr-2" />
          ℹ️ Quản lý Giới Thiệu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Sứ mệnh trường</Label>
          <Textarea
            value={aboutData.mission}
            onChange={(e) => setAboutData(prev => ({...prev, mission: e.target.value}))}
            rows={4}
          />
        </div>
        <div>
          <Label>Tầm nhìn trường</Label>
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
        
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">Thông tin hiệu trưởng</h3>
          <div>
            <Label>Tên hiệu trưởng</Label>
            <Input
              value={aboutData.principalName}
              onChange={(e) => setAboutData(prev => ({...prev, principalName: e.target.value}))}
            />
          </div>
          <div className="mt-4">
            <Label>Ảnh hiệu trưởng</Label>
            <ImageUploader
              onImageUpload={(url) => setAboutData(prev => ({...prev, principalImage: url}))}
              currentImage={aboutData.principalImage}
            />
          </div>
          <div className="mt-4">
            <Label>Thông điệp hiệu trưởng</Label>
            <Textarea
              value={aboutData.principalMessage}
              onChange={(e) => setAboutData(prev => ({...prev, principalMessage: e.target.value}))}
              rows={6}
            />
          </div>
        </div>

        <Button onClick={() => saveAboutMutation.mutate(aboutData)}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Giới Thiệu
        </Button>
      </CardContent>
    </Card>
  );
};

// 3. CHƯƠNG TRÌNH HỌC - Quản lý các chương trình
const ProgramsManager = () => {
  const { data: programs = [] } = useQuery({
    queryKey: ['/api/programs'],
  });

  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [programData, setProgramData] = useState({
    name: "",
    description: "",
    ageRange: "",
    tuition: "",
    capacity: ""
  });

  const { toast } = useToast();

  const saveProgramMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/programs", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật chương trình học" });
      setEditingProgram(null);
      setProgramData({ name: "", description: "", ageRange: "", tuition: "", capacity: "" });
    }
  });

  const handleEdit = (program: any) => {
    setEditingProgram(program);
    setProgramData({
      name: program.name,
      description: program.description,
      ageRange: program.ageRange,
      tuition: program.tuition?.toString() || "",
      capacity: program.capacity?.toString() || ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            📚 Quản lý Chương Trình Học
          </div>
          <Button onClick={() => window.open('/admin/dashboard', '_blank')} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Mở Dashboard Chính
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingProgram && (
          <div className="border p-4 rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-4">Chỉnh sửa chương trình: {editingProgram.name}</h3>
            <div className="space-y-3">
              <div>
                <Label>Tên chương trình</Label>
                <Input
                  value={programData.name}
                  onChange={(e) => setProgramData(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea
                  value={programData.description}
                  onChange={(e) => setProgramData(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Độ tuổi</Label>
                  <Input
                    value={programData.ageRange}
                    onChange={(e) => setProgramData(prev => ({...prev, ageRange: e.target.value}))}
                    placeholder="3-4 tuổi"
                  />
                </div>
                <div>
                  <Label>Sỉ số tối đa</Label>
                  <Input
                    value={programData.capacity}
                    onChange={(e) => setProgramData(prev => ({...prev, capacity: e.target.value}))}
                    placeholder="25"
                  />
                </div>
              </div>
              <div>
                <Label>Học phí (VND/tháng)</Label>
                <Input
                  value={programData.tuition}
                  onChange={(e) => setProgramData(prev => ({...prev, tuition: e.target.value}))}
                  placeholder="4000000"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => saveProgramMutation.mutate(programData)}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu chương trình
                </Button>
                <Button variant="outline" onClick={() => setEditingProgram(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(programs as any[]).map((program: any) => (
            <div key={program.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{program.name}</h4>
                  <p className="text-sm text-gray-600">{program.ageRange}</p>
                  <p className="text-sm mt-2">{program.description}</p>
                  <p className="text-sm font-medium text-green-600 mt-2">
                    Học phí: {program.tuition?.toLocaleString()} VND/tháng
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Sỉ số: {program.capacity} học sinh
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(program)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => {
                    if (confirm("Bạn có chắc muốn xóa chương trình này?")) {
                      console.log("Deleting program:", program.id);
                    }
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 4. HOẠT ĐỘNG - Quản lý hoạt động trường
const ActivitiesManager = () => {
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [activityData, setActivityData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    imageUrl: ""
  });

  const { toast } = useToast();

  const saveActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/activities", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã cập nhật hoạt động" });
      setEditingActivity(null);
      setActivityData({ name: "", description: "", date: "", location: "", imageUrl: "" });
    }
  });

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setActivityData({
      name: activity.name,
      description: activity.description,
      date: activity.date,
      location: activity.location,
      imageUrl: activity.imageUrl || ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            🎯 Quản lý Hoạt Động
          </div>
          <Button onClick={() => window.open('/admin/dashboard', '_blank')} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Mở Dashboard Chính
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingActivity && (
          <div className="border p-4 rounded-lg bg-green-50">
            <h3 className="font-semibold mb-4">Chỉnh sửa hoạt động: {editingActivity.name}</h3>
            <div className="space-y-3">
              <div>
                <Label>Tên hoạt động</Label>
                <Input
                  value={activityData.name}
                  onChange={(e) => setActivityData(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea
                  value={activityData.description}
                  onChange={(e) => setActivityData(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Ngày tổ chức</Label>
                  <Input
                    value={activityData.date}
                    onChange={(e) => setActivityData(prev => ({...prev, date: e.target.value}))}
                    placeholder="15/12/2024"
                  />
                </div>
                <div>
                  <Label>Địa điểm</Label>
                  <Input
                    value={activityData.location}
                    onChange={(e) => setActivityData(prev => ({...prev, location: e.target.value}))}
                    placeholder="Sân trường"
                  />
                </div>
              </div>
              <div>
                <Label>Hình ảnh hoạt động</Label>
                <SimpleImageUploader
                  onImageUpload={(url) => setActivityData(prev => ({...prev, imageUrl: url}))}
                  currentImage={activityData.imageUrl}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => saveActivityMutation.mutate(activityData)}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu hoạt động
                </Button>
                <Button variant="outline" onClick={() => setEditingActivity(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(activities as any[]).map((activity: any) => (
            <div key={activity.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{activity.name}</h4>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                  <p className="text-sm mt-2">{activity.description}</p>
                  <p className="text-sm text-blue-600 mt-2">📍 {activity.location}</p>
                  {activity.imageUrl && (
                    <img src={activity.imageUrl} alt={activity.name} className="w-16 h-16 object-cover rounded mt-2" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => {
                    if (confirm("Bạn có chắc muốn xóa hoạt động này?")) {
                      console.log("Deleting activity:", activity.id);
                    }
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 5. THƯ VIỆN PHỤ HUYNH - Quản lý tài liệu cho phụ huynh
const ParentLibraryManager = () => {
  const { data: documents = [] } = useQuery({
    queryKey: ['/api/parent-documents'],
  });

  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    downloadUrl: "",
    category: "guide"
  });

  const { toast } = useToast();

  const createDocMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/parent-documents", data);
    },
    onSuccess: () => {
      toast({ title: "Thành công", description: "Đã thêm tài liệu mới" });
      setNewDoc({ title: "", description: "", downloadUrl: "", category: "guide" });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          👨‍👩‍👧‍👦 Quản lý Thư Viện Phụ Huynh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border p-4 rounded-lg bg-blue-50">
          <h3 className="font-semibold mb-4">Thêm tài liệu mới</h3>
          <div className="space-y-3">
            <div>
              <Label>Tiêu đề tài liệu</Label>
              <Input
                value={newDoc.title}
                onChange={(e) => setNewDoc(prev => ({...prev, title: e.target.value}))}
                placeholder="VD: Hướng dẫn chuẩn bị cho năm học mới"
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={newDoc.description}
                onChange={(e) => setNewDoc(prev => ({...prev, description: e.target.value}))}
                rows={3}
              />
            </div>
            <div>
              <Label>Link tải về</Label>
              <Input
                value={newDoc.downloadUrl}
                onChange={(e) => setNewDoc(prev => ({...prev, downloadUrl: e.target.value}))}
                placeholder="https://..."
              />
            </div>
            <Button onClick={() => createDocMutation.mutate(newDoc)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm tài liệu
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Tài liệu hiện có</h3>
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
  );
};

// 6. TUYỂN SINH - Quản lý thông tin tuyển sinh
const AdmissionManager = () => {
  const [admissionData, setAdmissionData] = useState({
    generalInfo: "",
    requirements: "",
    process: "",
    schedule: "",
    tuition: "4,000,000",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          🎓 Quản lý Tuyển Sinh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Thông tin tổng quan</Label>
          <Textarea
            value={admissionData.generalInfo}
            onChange={(e) => setAdmissionData(prev => ({...prev, generalInfo: e.target.value}))}
            rows={4}
            placeholder="Thông tin chung về tuyển sinh năm học mới..."
          />
        </div>
        <div>
          <Label>Yêu cầu tuyển sinh</Label>
          <Textarea
            value={admissionData.requirements}
            onChange={(e) => setAdmissionData(prev => ({...prev, requirements: e.target.value}))}
            rows={4}
            placeholder="Điều kiện và yêu cầu đối với trẻ..."
          />
        </div>
        <div>
          <Label>Quy trình tuyển sinh</Label>
          <Textarea
            value={admissionData.process}
            onChange={(e) => setAdmissionData(prev => ({...prev, process: e.target.value}))}
            rows={4}
            placeholder="Các bước thực hiện đăng ký..."
          />
        </div>
        <div>
          <Label>Lịch tuyển sinh</Label>
          <Textarea
            value={admissionData.schedule}
            onChange={(e) => setAdmissionData(prev => ({...prev, schedule: e.target.value}))}
            rows={3}
            placeholder="Thời gian bắt đầu, kết thúc tuyển sinh..."
          />
        </div>
        <div>
          <Label>Học phí (VND/tháng)</Label>
          <Input
            value={admissionData.tuition}
            onChange={(e) => setAdmissionData(prev => ({...prev, tuition: e.target.value}))}
            placeholder="4,000,000"
          />
        </div>
        <div>
          <Label>Hồ sơ cần thiết</Label>
          <Textarea
            value={admissionData.documents}
            onChange={(e) => setAdmissionData(prev => ({...prev, documents: e.target.value}))}
            rows={4}
            placeholder="Danh sách giấy tờ cần chuẩn bị..."
          />
        </div>

        <Button onClick={() => saveAdmissionMutation.mutate(admissionData)}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Thông Tin Tuyển Sinh
        </Button>
      </CardContent>
    </Card>
  );
};

// 7. TIN TỨC - Quản lý tin tức
const NewsManager = () => {
  const { data: articles = [] } = useQuery({
    queryKey: ['/api/articles'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            📰 Quản lý Tin Tức
          </div>
          <Button onClick={() => window.open('/admin/dashboard', '_blank')} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Mở Dashboard Chính
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(articles as any[]).slice(0, 5).map((article: any) => (
            <div key={article.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{article.title}</h4>
                  <p className="text-sm text-gray-600">{article.category}</p>
                  <p className="text-sm mt-2">{article.excerpt}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.open('/admin/dashboard', '_blank')}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4">
          * Quản lý chi tiết tin tức trong Dashboard chính
        </p>
      </CardContent>
    </Card>
  );
};

// 8. LIÊN HỆ - Quản lý thông tin liên hệ
const ContactManager = () => {
  const [contactData, setContactData] = useState({
    phone: "0123 456 789",
    email: "mamnon@thaonguyenxanh.com",
    address: "123 Đường ABC, Quận XYZ, TP.HCM",
    workingHours: "Thứ 2 - Thứ 6: 7:00 - 17:00",
    googleMapsUrl: "",
    facebook: "",
    youtube: "",
    instagram: ""
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          📞 Quản lý Liên Hệ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        
        <div>
          <Label>Địa chỉ</Label>
          <Input
            value={contactData.address}
            onChange={(e) => setContactData(prev => ({...prev, address: e.target.value}))}
          />
        </div>
        
        <div>
          <Label>Giờ làm việc</Label>
          <Input
            value={contactData.workingHours}
            onChange={(e) => setContactData(prev => ({...prev, workingHours: e.target.value}))}
          />
        </div>
        
        <div>
          <Label>Link Google Maps</Label>
          <Input
            value={contactData.googleMapsUrl}
            onChange={(e) => setContactData(prev => ({...prev, googleMapsUrl: e.target.value}))}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">Mạng xã hội</h3>
          <div className="space-y-3">
            <div>
              <Label>Facebook</Label>
              <Input
                value={contactData.facebook}
                onChange={(e) => setContactData(prev => ({...prev, facebook: e.target.value}))}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input
                value={contactData.youtube}
                onChange={(e) => setContactData(prev => ({...prev, youtube: e.target.value}))}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={contactData.instagram}
                onChange={(e) => setContactData(prev => ({...prev, instagram: e.target.value}))}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        <Button onClick={() => saveContactMutation.mutate(contactData)}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Thông Tin Liên Hệ
        </Button>
      </CardContent>
    </Card>
  );
};

// Component chính - Tương ứng chính xác với thanh menu chính
export default function MainMenuManager() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản trị Menu Chính Website
          </h1>
          <p className="text-gray-600">
            Quản lý đầy đủ các mục trên thanh menu chính: Trang chủ, Giới thiệu, Chương trình học, Hoạt động, Thư viện phụ huynh, Tuyển sinh, Tin tức, Liên hệ
          </p>
        </div>

        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homepage">🏠 Trang chủ</TabsTrigger>
            <TabsTrigger value="about">ℹ️ Giới thiệu</TabsTrigger>
            <TabsTrigger value="programs">📚 Chương trình học</TabsTrigger>
            <TabsTrigger value="activities">🎯 Hoạt động</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <Tabs defaultValue="library" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="library">👨‍👩‍👧‍👦 Thư viện phụ huynh</TabsTrigger>
                <TabsTrigger value="admission">🎓 Tuyển sinh</TabsTrigger>
                <TabsTrigger value="news">📰 Tin tức</TabsTrigger>
                <TabsTrigger value="contact">📞 Liên hệ</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="mt-6">
                <ParentLibraryManager />
              </TabsContent>

              <TabsContent value="admission" className="mt-6">
                <AdmissionManager />
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                <NewsManager />
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <ContactManager />
              </TabsContent>
            </Tabs>
          </div>

          <TabsContent value="homepage" className="mt-6">
            <HomepageManager />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <AboutManager />
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <ProgramsManager />
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <ActivitiesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}