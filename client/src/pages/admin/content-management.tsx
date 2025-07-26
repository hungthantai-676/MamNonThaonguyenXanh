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
  Settings
} from "lucide-react";

// Component quản lý trang chủ
const HomePageManager = () => {
  const [heroData, setHeroData] = useState({
    title: "Mầm Non Thảo Nguyên Xanh",
    subtitle: "Nơi ươm mầm tương lai cho bé yêu",
    backgroundImage: "",
    features: []
  });

  const { toast } = useToast();

  const saveHomePageMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/homepage", data);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật trang chủ",
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Quản lý trang chủ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tiêu đề chính</Label>
          <Input 
            value={heroData.title}
            onChange={(e) => setHeroData(prev => ({...prev, title: e.target.value}))}
          />
        </div>
        <div>
          <Label>Phụ đề</Label>
          <Input 
            value={heroData.subtitle}
            onChange={(e) => setHeroData(prev => ({...prev, subtitle: e.target.value}))}
          />
        </div>
        <div>
          <Label>Ảnh nền</Label>
          <Input 
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setHeroData(prev => ({...prev, backgroundImage: e.target?.result as string}));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        <Button 
          onClick={() => saveHomePageMutation.mutate(heroData)}
          disabled={saveHomePageMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {saveHomePageMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Component quản lý trang giới thiệu
const AboutPageManager = () => {
  const [aboutData, setAboutData] = useState({
    mission: "",
    vision: "",
    history: "",
    teachers: [],
    facilities: []
  });

  const { toast } = useToast();

  const saveAboutMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/about", data);
    },
    onSuccess: () => {
      toast({
        title: "Thành công", 
        description: "Đã cập nhật trang giới thiệu",
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Quản lý trang giới thiệu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Sứ mệnh</Label>
          <Textarea
            value={aboutData.mission}
            onChange={(e) => setAboutData(prev => ({...prev, mission: e.target.value}))}
            rows={3}
          />
        </div>
        <div>
          <Label>Tầm nhìn</Label>
          <Textarea
            value={aboutData.vision}
            onChange={(e) => setAboutData(prev => ({...prev, vision: e.target.value}))}
            rows={3}
          />
        </div>
        <div>
          <Label>Lịch sử phát triển</Label>
          <Textarea
            value={aboutData.history}
            onChange={(e) => setAboutData(prev => ({...prev, history: e.target.value}))}
            rows={4}
          />
        </div>
        <Button 
          onClick={() => saveAboutMutation.mutate(aboutData)}
          disabled={saveAboutMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {saveAboutMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Component quản lý chương trình học
const ProgramsManager = () => {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['/api/programs'],
  });

  const [newProgram, setNewProgram] = useState({
    name: "",
    ageRange: "",
    description: "",
    tuition: "",
    features: []
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProgramMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/programs", data);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm chương trình mới",
      });
      setIsDialogOpen(false);
      setNewProgram({ name: "", ageRange: "", description: "", tuition: "", features: [] });
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
    }
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/programs/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa chương trình",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Quản lý chương trình học ({programs.length})
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm chương trình
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm chương trình mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tên chương trình</Label>
                  <Input
                    value={newProgram.name}
                    onChange={(e) => setNewProgram(prev => ({...prev, name: e.target.value}))}
                    placeholder="Ví dụ: Mầm 3-4 tuổi"
                  />
                </div>
                <div>
                  <Label>Độ tuổi</Label>
                  <Input
                    value={newProgram.ageRange}
                    onChange={(e) => setNewProgram(prev => ({...prev, ageRange: e.target.value}))}
                    placeholder="Ví dụ: 3-4 tuổi"
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    value={newProgram.description}
                    onChange={(e) => setNewProgram(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Học phí (VND)</Label>
                  <Input
                    value={newProgram.tuition}
                    onChange={(e) => setNewProgram(prev => ({...prev, tuition: e.target.value}))}
                    placeholder="4000000"
                  />
                </div>
                <Button 
                  onClick={() => createProgramMutation.mutate(newProgram)}
                  disabled={createProgramMutation.isPending}
                  className="w-full"
                >
                  {createProgramMutation.isPending ? "Đang thêm..." : "Thêm chương trình"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-4">
            {programs.map((program: any) => (
              <div key={program.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{program.name}</h3>
                    <p className="text-sm text-gray-600">{program.ageRange}</p>
                    <p className="text-sm mt-2">{program.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                      }).format(program.tuition)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteProgramMutation.mutate(program.id)}
                      disabled={deleteProgramMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component quản lý hoạt động
const ActivitiesManager = () => {
  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    images: []
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/activities", data);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm hoạt động mới",
      });
      setIsDialogOpen(false);
      setNewActivity({ name: "", description: "", date: "", location: "", images: [] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quản lý hoạt động ({activities.length})
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm hoạt động
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm hoạt động mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tên hoạt động</Label>
                  <Input
                    value={newActivity.name}
                    onChange={(e) => setNewActivity(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Ngày tổ chức</Label>
                  <Input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity(prev => ({...prev, date: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>Địa điểm</Label>
                  <Input
                    value={newActivity.location}
                    onChange={(e) => setNewActivity(prev => ({...prev, location: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>Hình ảnh</Label>
                  <Input type="file" accept="image/*" multiple />
                </div>
                <Button 
                  onClick={() => createActivityMutation.mutate(newActivity)}
                  disabled={createActivityMutation.isPending}
                  className="w-full"
                >
                  {createActivityMutation.isPending ? "Đang thêm..." : "Thêm hoạt động"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                  <p className="text-sm mt-2">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(activity.date).toLocaleDateString('vi-VN')}
                  </p>
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
      </CardContent>
    </Card>
  );
};

// Component chính
export default function ContentManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý nội dung website
          </h1>
          <p className="text-gray-600">
            Quản lý toàn bộ nội dung trên website mầm non
          </p>
        </div>

        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homepage">🏠 Trang chủ</TabsTrigger>
            <TabsTrigger value="about">ℹ️ Giới thiệu</TabsTrigger>
            <TabsTrigger value="programs">📚 Chương trình</TabsTrigger>
            <TabsTrigger value="activities">🎯 Hoạt động</TabsTrigger>
          </TabsList>

          <TabsContent value="homepage" className="mt-6">
            <HomePageManager />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <AboutPageManager />
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