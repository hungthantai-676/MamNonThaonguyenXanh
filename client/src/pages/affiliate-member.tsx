import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, Users, Wallet, Share2, LogOut } from "lucide-react";

export default function AffiliateMember() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('affiliate-user');
    const token = localStorage.getItem('affiliate-token');
    
    if (!userData || !token) {
      toast({
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để truy cập trang này",
        variant: "destructive",
      });
      setLocation("/"); // Fixed: redirect to homepage
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Generate QR code URL for referral link
      const referralLink = `${window.location.origin}/affiliate/join?ref=${parsedUser.memberId}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}`;
      setQrCodeUrl(qrUrl);
      
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLocation("/"); // Fixed: redirect to homepage
    }
  }, [setLocation, toast]);

  const handleCopyLink = () => {
    if (user) {
      const referralLink = `${window.location.origin}/affiliate/join?ref=${user.memberId}`;
      navigator.clipboard.writeText(referralLink).then(() => {
        toast({
          title: "Đã sao chép!",
          description: "Link giới thiệu đã được sao chép vào clipboard",
        });
      });
    }
  };

  const handleShare = async () => {
    if (user) {
      const referralLink = `${window.location.origin}/affiliate/join?ref=${user.memberId}`;
      const shareText = `🎓 Tham gia hệ thống Affiliate Mầm Non Thảo Nguyên Xanh!\n\n✨ Nhận thưởng hấp dẫn khi giới thiệu bạn bè\n🎯 ${user.memberType === 'teacher' ? 'Giáo viên: 2M VND/giới thiệu + 10M VND bonus mỗi 5 học sinh' : 'Phụ huynh: 2,000 điểm/giới thiệu + 10,000 điểm bonus mỗi 5 học sinh'}\n\n👉 Đăng ký ngay: ${referralLink}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Tham gia Affiliate Mầm Non Thảo Nguyên Xanh",
            text: shareText,
            url: referralLink
          });
        } catch (error) {
          console.log("Share cancelled");
        }
      } else {
        // Fallback to copying text
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: "Đã sao chép!",
            description: "Nội dung chia sẻ đã được sao chép",
          });
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('affiliate-user');
    localStorage.removeItem('affiliate-token');
    toast({
      title: "Đăng xuất thành công",  
      description: "Cảm ơn bạn đã sử dụng hệ thống",
    });
    setLocation("/"); // Fixed: redirect to homepage instead of non-existent page
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/affiliate/join?ref=${user.memberId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">🎯 Trang Thành Viên Affiliate</CardTitle>
                <p className="text-green-100 mt-2">Chào mừng {user.name}!</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.memberId}</div>
                <div className="text-sm text-gray-600">Mã thành viên</div>
              </div>
              <div className="text-center">
                <Badge variant={user.memberType === 'teacher' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                  {user.memberType === 'teacher' ? '👩‍🏫 Giáo viên' : '👨‍👩‍👧‍👦 Phụ huynh'}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Tổng giới thiệu</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-green-600" />
              Chương trình thưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
              {user.memberType === 'teacher' ? (
                <div>
                  <h3 className="font-bold text-green-700 mb-2">🎓 Chương trình Giáo viên:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>2,000,000 VND</strong> cho mỗi học sinh đăng ký thành công</li>
                    <li>• <strong>10,000,000 VND bonus</strong> khi đạt 5 học sinh</li>
                    <li>• Hoa hồng từ F2, F3 (học sinh được giới thiệu bởi F1 của bạn)</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold text-blue-700 mb-2">👨‍👩‍👧‍👦 Chương trình Phụ huynh:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>2,000 điểm</strong> cho mỗi phụ huynh đăng ký thành công</li>
                    <li>• <strong>10,000 điểm bonus</strong> khi đạt 5 phụ huynh</li>
                    <li>• Điểm thưởng từ F2, F3 (phụ huynh được giới thiệu bởi F1 của bạn)</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code & Referral Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                Mã QR giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {qrCodeUrl && (
                <div className="space-y-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code"
                    className="mx-auto border rounded-lg shadow-md"
                    width={200}
                    height={200}
                  />
                  <p className="text-sm text-gray-600">
                    Chia sẻ mã QR này để mọi người đăng ký qua link của bạn
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-green-600" />
                Link giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg border">
                <p className="text-sm text-gray-700 break-all font-mono">
                  {referralLink}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleCopyLink} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Sao chép Link
                </Button>
                
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
              
              <p className="text-xs text-gray-500">
                Gửi link này cho bạn bè để họ đăng ký qua giới thiệu của bạn
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Thống kê hiệu suất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">F1 (Trực tiếp)</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">F2 (Gián tiếp)</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">F3 (Cấp 3)</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {user.memberType === 'teacher' ? '0 VND' : '0 điểm'}
                </div>
                <div className="text-sm text-gray-600">Tổng thưởng</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">1</span>
                <p>Sao chép link giới thiệu hoặc chia sẻ mã QR với bạn bè</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">2</span>
                <p>Khi có người đăng ký qua link của bạn, bạn sẽ nhận được thưởng F1</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">3</span>
                <p>Khi F1 của bạn giới thiệu người khác, bạn nhận thưởng F2</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">4</span>
                <p>Hệ thống tự động tính toán và cộng thưởng vào tài khoản của bạn</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}