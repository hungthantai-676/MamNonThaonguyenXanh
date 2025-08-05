import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  currentVideoUrl?: string;
  onVideoChange: (videoUrl: string) => void;
  title: string;
}

export default function VideoUpload({ currentVideoUrl, onVideoChange, title }: VideoUploadProps) {
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = () => {
    if (videoUrl.trim()) {
      onVideoChange(videoUrl);
      toast({
        title: "Cập nhật video thành công",
        description: "URL video đã được cập nhật",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('/api/admin/upload-video', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const fullVideoUrl = window.location.origin + result.videoUrl;
        setVideoUrl(fullVideoUrl);
        onVideoChange(fullVideoUrl);
        toast({
          title: "Upload thành công",
          description: "Video đã được tải lên và lưu trữ",
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi upload",
        description: "Không thể upload video. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl("");
    onVideoChange("");
    toast({
      title: "Đã xóa video",
      description: "Video đã được gỡ bỏ",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentVideoUrl && (
          <div className="mb-4">
            <Label>Video hiện tại:</Label>
            <div className="mt-2 border rounded-lg p-2">
              <video 
                src={currentVideoUrl} 
                className="max-w-full h-32 object-cover rounded"
                controls
                onError={(e) => {
                  console.error('Video load error');
                }}
              />
              <Button 
                onClick={handleRemoveVideo}
                variant="destructive" 
                size="sm" 
                className="mt-2"
              >
                Xóa video
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL video mới:</Label>
          <div className="flex space-x-2">
            <Input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} disabled={!videoUrl.trim()}>
              Cập nhật
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Hoặc tải video từ máy tính:</Label>
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
              id={`video-upload-${title}`}
            />
            <Button
              onClick={() => document.getElementById(`video-upload-${title}`)?.click()}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Đang tải..." : "🎬 Chọn video từ máy tính"}
            </Button>
          </div>
          {isLoading && <p className="text-sm text-gray-500 text-center">Đang tải video...</p>}
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Hỗ trợ các định dạng: MP4, WebM, MOV</p>
          <p>• Dung lượng tối đa: 50MB</p>
          <p>• Video sẽ được lưu trên server</p>
        </div>
      </CardContent>
    </Card>
  );
}