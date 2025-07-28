import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Share2, QrCode, Link, Users, DollarSign } from "lucide-react";

export default function AffiliateMemberInfo() {
  const { toast } = useToast();
  const [memberCode, setMemberCode] = useState("");
  const [currentMember, setCurrentMember] = useState<any>(null);

  // Get member code from localStorage or URL
  useEffect(() => {
    const token = localStorage.getItem("affiliate-token");
    if (token) {
      setMemberCode(token);
    }
  }, []);

  // Fetch all members to find current member
  const { data: members, isLoading } = useQuery({
    queryKey: ["/api/affiliate/members"],
    enabled: !!memberCode,
  });

  // Find current member info
  useEffect(() => {
    if (members && memberCode) {
      const member = Array.isArray(members) 
        ? members.find((m: any) => m.username === memberCode || m.memberId === memberCode) 
        : null;
      setCurrentMember(member);
    }
  }, [members, memberCode]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Đã sao chép!",
        description: `${type} đã được sao chép vào clipboard`,
      });
    });
  };

  const downloadQRCode = (qrData: string, memberName: string) => {
    const link = document.createElement('a');
    link.href = qrData;
    link.download = `QR-${memberName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Tải xuống thành công!",
      description: "QR Code đã được tải về máy",
    });
  };

  const shareReferralLink = (link: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Tham gia Mầm Non Thảo Nguyên Xanh',
        text: 'Hãy tham gia cùng tôi tại Mầm Non Thảo Nguyên Xanh!',
        url: link,
      });
    } else {
      copyToClipboard(link, "Link giới thiệu");
    }
  };

  if (!memberCode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Đăng nhập thành viên</CardTitle>
              <CardDescription>Nhập tên đăng nhập để xem thông tin QR Code và link giới thiệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code">Tên đăng nhập</Label>
                <Input
                  id="code"
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  placeholder="Nhập tên đăng nhập của bạn"
                />
              </div>
              <Button 
                onClick={() => {
                  if (memberCode) {
                    localStorage.setItem("affiliate-token", memberCode);
                    window.location.reload();
                  }
                }}
                disabled={!memberCode}
                className="w-full"
              >
                Xem thông tin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Không tìm thấy thành viên</h2>
              <p className="text-muted-foreground mb-4">Tên đăng nhập không hợp lệ hoặc không tồn tại</p>
              <Button onClick={() => {
                localStorage.removeItem("affiliate-token");
                setMemberCode("");
              }}>
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Thông tin thành viên Affiliate</h1>
          <p className="text-muted-foreground">QR Code và link giới thiệu cho thành viên F2, F3</p>
        </div>

        {/* Member Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thông tin cá nhân</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMember.name}</div>
              <p className="text-xs text-muted-foreground">{currentMember.email}</p>
              <Badge variant={currentMember.memberType === "teacher" ? "default" : "secondary"} className="mt-2">
                {currentMember.memberType === "teacher" ? "Giáo viên" : "Phụ huynh"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số người giới thiệu</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMember.totalReferrals || 0}</div>
              <p className="text-xs text-muted-foreground">Thành viên đã tham gia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số dư ví</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parseFloat(currentMember.tokenBalance || "0").toLocaleString()} Token</div>
              <p className="text-xs text-muted-foreground">Hoa hồng tích lũy</p>
            </CardContent>
          </Card>
        </div>

        {/* QR Code and Referral Link */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code giới thiệu
              </CardTitle>
              <CardDescription>
                Chia sẻ QR Code này cho người khác để họ đăng ký dưới bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  <img 
                    src={currentMember.qrCode} 
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => downloadQRCode(currentMember.qrCode, currentMember.name)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(currentMember.qrCode, "QR Code data")}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Sao chép
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Link giới thiệu
              </CardTitle>
              <CardDescription>
                Gửi link này cho F2, F3 để họ đăng ký thành thành viên dưới bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Mã thành viên của bạn</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentMember.memberId} 
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentMember.memberId, "Mã thành viên")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Link giới thiệu</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentMember.referralLink} 
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentMember.referralLink, "Link giới thiệu")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Địa chỉ ví</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={currentMember.walletAddress} 
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(currentMember.walletAddress, "Địa chỉ ví")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => shareReferralLink(currentMember.referralLink)}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open(currentMember.referralLink, '_blank')}
                  className="flex-1"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Xem trước
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🔑 Mã thành viên là gì?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Mã định danh duy nhất của bạn trong hệ thống</li>
                  <li>• Được tạo tự động khi đăng ký</li>
                  <li>• Dùng để đăng nhập và quản lý tài khoản</li>
                  <li>• Không thể thay đổi hoặc trùng lặp</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">📱 Cách chia sẻ cho F2, F3</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Gửi QR Code qua tin nhắn, email</li>
                  <li>• Chia sẻ link trực tiếp trên mạng xã hội</li>
                  <li>• In QR Code để dán tại nơi cần thiết</li>
                  <li>• Người được giới thiệu quét QR hoặc click link</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            onClick={() => {
              localStorage.removeItem("affiliate-token");
              setMemberCode("");
              setCurrentMember(null);
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}