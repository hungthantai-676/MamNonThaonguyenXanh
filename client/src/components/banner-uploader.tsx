import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BannerUploaderProps {
  currentBanner?: string;
  onBannerUpdate: (bannerUrl: string) => void;
}

export default function BannerUploader({ currentBanner, onBannerUpdate }: BannerUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentBanner || "");
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi", 
        description: "File quá lớn. Vui lòng chọn file nhỏ hơn 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      // Create FormData for upload
      const formData = new FormData();
      formData.append('banner', file);

      // Upload to server
      const response = await fetch('/api/admin/upload-banner', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Update with server URL
      setPreviewUrl(result.bannerUrl);
      onBannerUpdate(result.bannerUrl);

      toast({
        title: "Thành công",
        description: "Banner đã được cập nhật",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể upload banner. Vui lòng thử lại",
        variant: "destructive",
      });
      // Reset preview on error
      setPreviewUrl(currentBanner || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveBanner = async () => {
    try {
      await fetch('/api/admin/remove-banner', {
        method: 'DELETE',
      });

      setPreviewUrl("");
      onBannerUpdate("");

      toast({
        title: "Thành công",
        description: "Banner đã được xóa",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa banner",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Banner Trang Chủ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Banner Preview */}
        {previewUrl && (
          <div className="relative">
            <img 
              src={previewUrl}
              alt="Banner hiện tại"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveBanner}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="banner-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click để chọn file</span> hoặc kéo thả
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
              </div>
              <input 
                id="banner-upload"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          {isUploading && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold text-sm leading-6 text-blue-600 bg-blue-100 rounded-md">
                <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Đang upload...
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Khuyến nghị:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Kích thước: 1920x600 pixels</li>
            <li>Định dạng: JPG, PNG</li>
            <li>Dung lượng: Dưới 5MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}