import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onImageUpload, currentImage }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "");

  const handleSubmit = () => {
    if (imageUrl.trim()) {
      onImageUpload(imageUrl.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Dán link hình ảnh..."
          className="flex-1"
        />
        <Button onClick={handleSubmit} size="sm">
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
}