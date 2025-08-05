import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  title: string;
}

export default function ImageUpload({ currentImageUrl, onImageChange, title }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageChange(imageUrl);
      toast({
        title: "Cập nhật ảnh thành công",
        description: "URL ảnh đã được cập nhật",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const fullImageUrl = window.location.origin + result.imageUrl;
        setImageUrl(fullImageUrl);
        onImageChange(fullImageUrl);
        toast({
          title: "Upload thành công",
          description: "Ảnh đã được tải lên và lưu trữ",
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi upload",
        description: "Không thể upload ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentImageUrl && (
          <div className="mb-4">
            <Label>Ảnh hiện tại:</Label>
            <div className="mt-2 border rounded-lg p-2">
              <img 
                src={currentImageUrl} 
                alt="Current" 
                className="max-w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150x100?text=No+Image";
                }}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL ảnh mới:</Label>
          <div className="flex space-x-2">
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
              Cập nhật
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Hoặc</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload lên imgur.com hoặc cloudinary.com rồi copy link vào ô URL
          </p>
        </div>
      </CardContent>
    </Card>
  );
}