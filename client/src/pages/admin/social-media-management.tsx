import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { FaFacebook, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

interface SocialMediaLink {
  id: number;
  platform: string;
  url: string;
  displayName: string;
  followers: number;
  isActive: boolean;
}

interface SocialMediaFormData {
  platform: string;
  url: string;
  displayName: string;
  followers: number;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <FaFacebook className="w-5 h-5 text-blue-600" />;
    case 'youtube':
      return <FaYoutube className="w-5 h-5 text-red-600" />;
    case 'instagram':
      return <FaInstagram className="w-5 h-5 text-pink-600" />;
    case 'tiktok':
      return <FaTiktok className="w-5 h-5 text-black" />;
    default:
      return <div className="w-5 h-5 bg-gray-400 rounded" />;
  }
};

const platforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
];

function SocialMediaForm({ 
  link, 
  onSave, 
  onCancel 
}: { 
  link?: SocialMediaLink; 
  onSave: (data: SocialMediaFormData) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<SocialMediaFormData>({
    platform: link?.platform || '',
    url: link?.url || '',
    displayName: link?.displayName || '',
    followers: link?.followers || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="platform">Nền tảng</Label>
        <Select 
          value={formData.platform} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn nền tảng" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map(platform => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://facebook.com/mamnonthaonguyenxanh"
          required
        />
      </div>

      <div>
        <Label htmlFor="displayName">Tên hiển thị</Label>
        <Input
          id="displayName"
          value={formData.displayName}
          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
          placeholder="@MamNonThaoNguyenXanh"
        />
      </div>

      <div>
        <Label htmlFor="followers">Số người theo dõi</Label>
        <Input
          id="followers"
          type="number"
          value={formData.followers}
          onChange={(e) => setFormData(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))}
          placeholder="0"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" className="bg-primary-green hover:bg-primary-green/90">
          {link ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  );
}

export default function SocialMediaManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialMediaLink | null>(null);

  const { data: socialLinks, isLoading } = useQuery<SocialMediaLink[]>({
    queryKey: ["/api/social-media"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: SocialMediaFormData) => {
      await apiRequest("POST", "/api/social-media", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media"] });
      toast({
        title: "Thành công",
        description: "Đã thêm kênh mạng xã hội mới",
      });
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể thêm kênh mạng xã hội",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SocialMediaFormData) => {
      if (!editingLink) return;
      await apiRequest("PUT", `/api/social-media/${editingLink.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật kênh mạng xã hội",
      });
      setEditingLink(null);
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật kênh mạng xã hội",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/social-media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media"] });
      toast({
        title: "Thành công",
        description: "Đã xóa kênh mạng xã hội",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa kênh mạng xã hội",
        variant: "destructive",
      });
    },
  });

  const handleSave = (data: SocialMediaFormData) => {
    if (editingLink) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa kênh mạng xã hội này?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🌐 Quản lý mạng xã hội</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-green hover:bg-primary-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Thêm kênh mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm kênh mạng xã hội</DialogTitle>
            </DialogHeader>
            <SocialMediaForm 
              onSave={handleSave}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {socialLinks?.map((link) => (
          <Card key={link.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {getPlatformIcon(link.platform)}
                  <div>
                    <CardTitle className="text-lg">
                      {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{link.displayName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {link.followers.toLocaleString()} người theo dõi
                  </Badge>
                  {link.isActive && (
                    <Badge className="bg-green-100 text-green-800">
                      Hoạt động
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span className="truncate max-w-64">{link.url}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLink(link)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {!socialLinks?.length && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">Chưa có kênh mạng xã hội nào</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary-green hover:bg-primary-green/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm kênh đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {editingLink && (
        <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa kênh mạng xã hội</DialogTitle>
            </DialogHeader>
            <SocialMediaForm 
              link={editingLink}
              onSave={handleSave}
              onCancel={() => setEditingLink(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}