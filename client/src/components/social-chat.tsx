import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Facebook, Phone } from "lucide-react";

export default function SocialChat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleZaloChat = () => {
    // Open Zalo chat with the phone number
    window.open('https://zalo.me/0123456789', '_blank');
  };

  const handleFacebookChat = () => {
    // Open Facebook Messenger
    window.open('https://m.me/mamnonthaonguyenxanh', '_blank');
  };

  const handlePhoneCall = () => {
    // Make a phone call
    window.location.href = 'tel:0123456789';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700 shadow-lg animate-pulse"
          >
            <MessageCircle className="w-8 h-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">💬 Liên hệ với chúng tôi</DialogTitle>
            <DialogDescription className="text-center">
              Chọn cách liên hệ phù hợp với bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              onClick={handleZaloChat}
              className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-3"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-500 font-bold text-sm">
                Z
              </div>
              Chat qua Zalo
            </Button>
            
            <Button 
              onClick={handleFacebookChat}
              className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <Facebook className="w-6 h-6" />
              Chat qua Facebook
            </Button>
            
            <Button 
              onClick={handlePhoneCall}
              className="w-full flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3"
            >
              <Phone className="w-6 h-6" />
              Gọi điện: 0123456789
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}